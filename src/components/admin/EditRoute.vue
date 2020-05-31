<template>
  <div class="admin-container">
    <div class="admin-container-header">
      <h2>Edit Route</h2>
      <button class="admin-button admin-button-end" @click="$emit('close')">Terug naar Overzicht</button>
    </div>
    <label class="admin-label">Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <p v-if="slug" class="admin-feedback admin-feedback-dark">/{{ slug }}</p>
    <label class="admin-label">Categorie</label>
    <select v-model="type" class="admin-input">
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
      <option v-for="group in groups" :value="group.id" :key="group.id">{{group.name}}</option>
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
      <button class="admin-button admin-button-publish" @click="update">Update</button>
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
  name: 'EditRoute',
  props: {
    route: Object
  },
  data() {
    return {
      name: '',
      type: null,
      group: null,
      coverImage: null,
      distance: 0,
      coordinates: [],
      mapStyle: 'mapbox://styles/mapbox/outdoors-v10',
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
    setRoute() {
      this.name = this.route.name
      this.type = this.route.type
      this.group = this.route.group
      // Download cover image
      const storage = firebase.storage()
      storage.ref(this.route.coverImage).getDownloadURL().then(result => {
        this.coverImage = { name: this.route.coverImage, data: null, result }
      }).catch(err => {
        console.log(err)
      })

      this.getRouteData()
    },
    getRouteData() {
      firebase.firestore().doc(this.route.data).get().then(doc => {
        if (doc.exists) {
          const data = doc.data()
          this.coordinates = data.coordinates.map(item => [item.lng, item.lat])
          this.setupMap()
          const routePoints = data.routePoints ? data.routePoints : data.bikePoints
          if (routePoints.length > 0) {
            this.setRoutePoints(routePoints)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setRoutePoints(points) {
      points.forEach(point => {
        const el = document.createElement('div')
        el.className = isOranjenassau ? 'route-point hex' : 'route-point'
        el.innerHTML = point.name

        const markerId = uuid()
        const marker = new mapbox.Marker({ draggable: true, element: el })
          .setLngLat([point.lng, point.lat])
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

        this.markers.push({id: markerId, name: point.name, coordinates: marker.getLngLat(), marker })
      })
    },
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
    update() {
      if (
        this.name.trim() !== '' &&
        this.type !== null
      ) {
        this.feedback = 'Gegevens uploaden..'
        const storage = firebase.storage().ref()
        if (this.coverImage.data !== null) {
          storage.child(this.route.coverImage).delete()
          // Upload new image
          storage.child('cover/' + this.coverImage.name).put(this.coverImage.data).then(img => {
            this.updateDocuments(img.metadata.fullPath)
          })
        } else {
          this.updateDocuments(this.route.coverImage)
        }
      } else {
        this.feedback = 'Eerst alle velden invullen'
      }
    },
    updateDocuments(coverPath) {
      const db = firebase.firestore()

      const route = {
        slug: this.slug,
        name: this.name,
        type: this.type,
        group: this.group === 'null' ? null : this.group,
        coverImage: coverPath
      }
      
      const routePoints = this.markers.map(marker => { return { name: marker.name, lng: marker.coordinates.lng, lat: marker.coordinates.lat } })
      const routeData = { routePoints, bikePoints: null }

      const uploadRouteData = db.doc(this.route.data).update(routeData)
      const uploadRoute = db.collection(routesCollection).doc(this.route.id).update(route)

      Promise.all([uploadRouteData, uploadRoute]).then(() => {
        this.feedback = null
        this.$emit('close')
      }).catch(err => {
        this.feedback = 'Uploading mislukt.. Probeer opnieuw'
      })
    },
    setupMap () {
      const coordinates = this.coordinates

      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord)
      }, new mapbox.LngLatBounds(coordinates[0], coordinates[0]))
      this.map.fitBounds(bounds, { padding: 40, duration: 0 })

      this.map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": coordinates
            }
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#008D36",
          "line-width": 6
        }
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
  created() {
    this.setRoute()
  },
  mounted() {
    this.map = new mapbox.Map({
      container: 'route-map',
      style: this.mapStyle,
      attributionControl: false,
      center: [4.9443857, 51.5416528],
      zoom: 10
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