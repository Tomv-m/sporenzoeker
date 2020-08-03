<template>
  <div class="admin-container">
    <div class="admin-container-header">
      <h2>Nieuwe Route Maken</h2>
      <button class="admin-button admin-button-end" @click="$emit('close')">Terug naar Overzicht</button>
    </div>
    <label class="admin-label">Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <p v-if="slug" class="admin-feedback admin-feedback-dark">/{{ slug }}</p>
    <label class="admin-label">Categorie</label>
    <select v-model="type" class="admin-input">
      <option value="null">-- maak keuzen --</option>
      <option value="fietsen">
        Fietsen
      </option>
      <option value="lopen">
        Wandelen
      </option>
    </select>
    <label class="admin-label">In groep plaatsen</label>
    <select class="admin-input" :disabled="type === null || type === 'null' && groups.lenght !== 0" v-model="group">
      <option value="null">Niet in groep</option>
      <option v-for="group in groups" :value="group.slug" :key="group.id">{{group.name}}</option>
    </select>
    <div>
      <label class="admin-label">Cover Afbeelding <span>100 x 100</span></label>
      <div class="admin-image-cover">
        <img v-if="coverImage" :src="coverImage.result" />
      </div>
      <input class="admin-input-file" type="file" @change="selectCoverImage">
      <p v-if="coverFeedback" class="admin-feedback">{{ coverFeedback }}</p>
      <p v-else-if="coverImageName !== ''" class="admin-feedback admin-feedback-dark">{{coverImageName}}</p>
    </div>
    <div>
      <label class="admin-label">Route</label>
      <div style="position: relative;">
        <div id="route-map"></div>
        <div class="distance-container">{{ parseFloat(distance).toFixed(2) }} km</div>
      </div>
    </div>
    <div class="admin-route-points">
      <form @submit.prevent="addMarker" autocomplete="off">
        <input type="text" class="admin-input" id="marker-input" style="width:auto;display:inline-block;margin-right:12px;" v-model="markerValue" placeholder="Route punt">
        <button class="admin-button">Toevoegen</button>
        <p class="admin-feedback admin-feedback-dark">Verwijder een punt door er dubbel op te klikken</p>
      </form>
    </div>
    <div>
      <button class="admin-button admin-button-publish" @click="publish">Publiseer</button>
      <p v-if="feedback" class="admin-feedback">{{ feedback }}</p>
    </div>
  </div>
</template>

<script>
import mapbox from 'mapbox-gl'
import firebase from 'firebase/app'
import { v4 as uuid } from 'uuid'
import slugify from 'slugify'
import turf from '@turf/length'

import { routesCollection, routeDataCollection, isOranjenassau } from '../../global'

export default {
  name: 'Route',
  data() {
    return {
      name: '',
      type: null,
      group: null,
      coverImage: null,
      distance: 0,
      coordinates: [],
      mapStyle: 'mapbox://styles/v-mtom/ckddgaaie42tu1jmwj7cbbv1f',
      groups: [],
      coverFeedback: null,
      map: null,
      feedback: null,
      coverImageName: '',
      markerValue: '',
      markers: []
    }
  },
  computed: {
    slug () {
      return this.name.trim() !== '' ? slugify(this.name.toLowerCase()) : null
    }
  },
  methods: {
    selectImage(selectedFile, imageSize) {
      return new Promise((resolve, reject) => {
        const file = selectedFile.target.files[0]
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const img = new Image
            img.src = reader.result
            img.onload = function() {
              if (imageSize.h === this.height && imageSize.w === this.width) {
                const name = `${uuid()}-${file.name}`
                resolve({ name, data: file, result: reader.result })
              } else {
                reject(`Niet juiste grote ${imageSize.w} x ${imageSize.h}`)
              }
            }
          }
        } else {
          reject('Er is geen afbeelding geselecteerd')
        }
      })
    },
    selectCoverImage(e) {
      this.coverFeedback = null
      if (e.target.files[0]) {
        this.selectImage(e, { h: 100, w: 100 }).then(image => {
          this.coverImageName = image.data.name
          this.coverImage = image
        }).catch(m => {
          this.coverFeedback = m
        })
      }
    },
    addMarker() {
      if (this.markerValue.trim() !== '') {
        const el = document.createElement('div')
        el.className = isOranjenassau ? 'route-point hex' : 'route-point'
        el.innerHTML = this.markerValue

        const mapCenter = this.map.getCenter()
        const markerId = uuid()
        const marker = new mapbox.Marker({ draggable: true, element: el })
          .setLngLat([mapCenter.lng, mapCenter.lat])
          .addTo(this.map)

        el.addEventListener('dblclick', () => {
          const markerIndex = this.markers.findIndex(marker => marker.id === markerId)
          this.markers.splice(markerIndex, 1)
          marker.remove()
        })

        marker.on('dragend', () => {
          const markerIndex = this.markers.findIndex(marker => marker.id === markerId)
          const newCoordinates = marker.getLngLat()
          this.markers[markerIndex].coordinates = newCoordinates
        })

        this.markers.push({id: markerId, name: this.markerValue, coordinates: marker.getLngLat(), marker })
        this.markerValue = ''
      }
    },
    publish() {
      if (
        this.name.trim() !== '' &&
        this.type !== null &&
        this.coverImage !== null &&
        this.coordinates.length > 0
      ) {
        this.feedback = 'Gegevens uploaden..'
        const storage = firebase.storage().ref()
        const db = firebase.firestore()

        const routePoints = this.markers.map(marker => { return { name: marker.name, lng: marker.coordinates.lng, lat: marker.coordinates.lat } })
        const coordinates = this.coordinates.map(coordinates => { return { lng: coordinates[0], lat: coordinates[1]  } })
        const uploadCover = storage.child('cover/' + this.coverImage.name).put(this.coverImage.data)
        const uploadData = db.collection(routeDataCollection).add({ routePoints, coordinates })
        Promise.all([uploadCover, uploadData]).then(values => {
          const coverPath = values[0].metadata.fullPath
          const dataPath = values[1].path
          const route = {
            slug: this.slug,
            name: this.name,
            distance: this.distance,
            type: this.type,
            group: this.group === 'null' ? null : this.group,
            coverImage: coverPath,
            data: dataPath
          }
          db.collection(routesCollection).doc(this.slug).set(route).then(doc => {
            this.feedback = null
            this.$emit('close')
          })
        }).catch(err => {
          console.log(err)
          this.feedback = 'Uploading mislukt.. Probeer opnieuw'
        })
      } else {
        this.feedback = 'Eerst alle velden invullen'
      }
    },
    setupMap () {
      let geojson = {
        type: 'FeatureCollection',
        features: []
      }

      let linestring = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }

      this.map.addSource('geojson', {
        type: 'geojson',
        data: geojson
      })

      this.map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#008D36'
        },
        filter: ['in', '$type', 'Point']
      })

      this.map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#008D36',
          'line-width': 3
        },
        filter: ['in', '$type', 'LineString']
      })

      this.map.on('click', e => {  
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['measure-points']
        })

        if (geojson.features.length > 1) geojson.features.pop()

        if (features.length) {
          const id = features[0].properties.id
          geojson.features = geojson.features.filter(point => {
            return point.properties.id !== id
          })
        } else {
          const point = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            },
            properties: {
              id: uuid()
            }
          }

          geojson.features.push(point)
        }

        if (geojson.features.length > 1) {
          linestring.geometry.coordinates = geojson.features.map(point => {
            return point.geometry.coordinates
          })

          geojson.features.push(linestring)

          this.distance = turf(linestring)
          
          this.coordinates = linestring.geometry.coordinates
        }

        this.map.getSource('geojson').setData(geojson)
      })

      this.map.on('mousemove', e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['measure-points']
        })

        this.map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair'
      })
    },
    setInputFilter(textbox, inputFilter) {
      ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop', 'onpaste'].forEach(function(event) {
        textbox.addEventListener(event, function() {
          if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty('oldValue')) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          } else {
            this.value = "";
          }
        });
      })
    }
  },
  mounted() {
    this.map = new mapbox.Map({
      container: 'route-map',
      style: this.mapStyle,
      attributionControl: false,
      center: [4.9443857, 51.5416528],
      zoom: 10
    })
    
    this.map.on('load', () => {
      this.setupMap()
    })

    this.setInputFilter(document.getElementById('marker-input'), value => /^\d*$/.test(value))
  },
  watch: {
    type (newValue) {
      if (newValue === null || newValue === 'null') {
        this.groups = []
        return
      }
      const groupRef = firebase.firestore().collection('routes').where('data', '==', null).where('type', '==', this.type)
      groupRef.get().then(snapshot => {
        let groups = []
        snapshot.forEach(doc => {
          groups.push({ id: doc.id, ...doc.data() })
        })
        this.groups = groups
      })
    }
  }
}
</script>

<style lang="scss">
.distance-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
 
.distance-container > * {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  display: block;
  margin: 0;
  padding: 5px 10px;
  border-radius: 3px;
}
</style>