<template>
  <div>
    <h2>Nieuwe Route Maken</h2>
    <label>Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <label>Categorie</label>
    <select v-model="type" class="admin-input">
      <option value="null">-- maak keuzen --</option>
      <option value="fietsen">
        Fietsen
      </option>
      <option value="lopen">
        Wandelen
      </option>
    </select>
    <label>In groep plaatsen</label>
    <select class="admin-input" :disabled="type === null || type === 'null' && groups.lenght !== 0" v-model="group">
      <option value="null">Niet in groep</option>
      <option v-for="group in groups" :value="group.id" :key="group.id">{{group.name}}</option>
    </select>
    <div>
      <label>Cover Afbeelding</label><br><small>100 x 100</small>
      <input class="admin-input" type="file" @change="selectCoverImage">
      <p v-if="coverFeedback" style="color: red;">{{ coverFeedback }}</p>
    </div>
    <div>
      <label>Maak route</label>
      <div style="position: relative;">
        <div id="route-map"></div>
        <div class="distance-container">{{ parseFloat(distance).toFixed(2) }} km</div>
      </div>
    </div>
    <input type="checkbox" id="fietsknooppunten" v-model="addBikepoints">
    <label for="fietsknooppunten">Route Punten</label>
    <BikepointMap v-if="addBikepoints" :mapStyle="mapStyle" v-model="bikePoints" />
    <div>
      <button @click="$emit('close')">X</button>
      <button @click="publish">Publiseer</button>
      <p v-if="feedback">{{ feedback }}</p>
    </div>
  </div>
</template>

<script>
import mapbox from 'mapbox-gl'
import firebase from 'firebase/app'
import { v4 as uuid } from 'uuid'
import slugify from 'slugify'
import turf from '@turf/length'

import BikepointMap from './BikepointMap.vue'

import { routesCollection, routeDataCollection } from '../../global'

export default {
  name: 'Route',
  components: {
    BikepointMap
  },
  data() {
    return {
      name: '',
      type: null,
      group: null,
      coverImage: null,
      distance: 0,
      coordinates: [],
      bikePoints: [],
      // component state
      mapStyle: 'mapbox://styles/mapbox/outdoors-v10',
      addBikepoints: false,
      groups: [],
      coverFeedback: null,
      routeMap: null,
      feedback: null
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
                resolve({ name, data: file })
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
      this.selectImage(e, { h: 100, w: 100 }).then(image => {
        this.coverImage = image
      }).catch(m => {
        this.coverFeedback = m
      })
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

        const bikePoints = this.bikePoints.map(bikePoint => { return { name: bikePoint.name, lng: bikePoint.coordinates.lng, lat: bikePoint.coordinates.lat } })
        const coordinates = this.coordinates.map(coordinates => { return { lng: coordinates[0], lat: coordinates[1]  } })
        const uploadCover = storage.child('cover/' + this.coverImage.name).put(this.coverImage.data)
        const uploadData = db.collection(routeDataCollection).add({ bikePoints, coordinates })
        Promise.all([uploadCover, uploadData]).then(values => {
          const coverPath = values[0].metadata.fullPath
          const dataPath = values[1].path
          const route = {
            name: this.name,
            distance: this.distance,
            type: this.type,
            group: this.group,
            coverImage: coverPath,
            data: dataPath
          }
          db.collection(routesCollection).doc(slugify(this.name.toLowerCase())).set(route).then(doc => {
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
    setupRouteMap () {
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

      this.routeMap.addSource('geojson', {
        type: 'geojson',
        data: geojson
      })

      this.routeMap.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#008D36'
        },
        filter: ['in', '$type', 'Point']
      })

      this.routeMap.addLayer({
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

      this.routeMap.on('click', e => {  
        const features = this.routeMap.queryRenderedFeatures(e.point, {
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

        this.routeMap.getSource('geojson').setData(geojson)
      })

      this.routeMap.on('mousemove', e => {
        const features = this.routeMap.queryRenderedFeatures(e.point, {
          layers: ['measure-points']
        })

        this.routeMap.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair'
      })
    },
  },
  mounted() {
    this.routeMap = new mapbox.Map({
      container: 'route-map',
      style: this.mapStyle,
      attributionControl: false,
      center: [4.9443857, 51.5416528],
      zoom: 10
    })
    
    this.routeMap.on('load', () => {
      this.setupRouteMap()
    })
  },
  watch: {
    type (newQ, oldQ) {
      if (newQ === null || newQ === 'null') {
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