<template>
  <div class="admin-container">
    <div class="admin-container-header">
      <h2>Nieuwe Locatie Maken</h2>
      <button class="admin-button admin-button-end" @click="$emit('close')">Terug naar Overzicht</button>
    </div>
    <label class="admin-label">Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <label class="admin-label">Telefoon</label>
    <input type="text" class="admin-input" id="point-input" placeholder="Telefoon nummer" v-model="phone">
    <label class="admin-label">Meer info</label>
    <input type="text" class="admin-input" placeholder="Website URL" v-model="site">
    <label class="admin-label">Categorie</label>
    <div class="admin-categories">
      <button @click="() => { category = 'Overnachten'; type = 'bed' }" :class="{ 'active':  type === 'bed' }">
        <img src="@/assets/images/icons/bed.png" alt="Bed">
      </button>
      <button @click="() => { category = 'Overnachten'; type = 'tent' }" :class="{ 'active':  type === 'tent' }">
        <img src="@/assets/images/icons/tent.png" alt="Tent">
      </button>
      <button @click="() => { category = 'Aanbod Recreatie'; type = 'klaver' }" :class="{ 'active':  type === 'klaver' }">
        <img src="@/assets/images/icons/klaver.png" alt="Klaver">
      </button>
      <button @click="() => { category = 'Aanbod Recreatie'; type = 'ster' }" :class="{ 'active':  type === 'ster' }">
        <img src="@/assets/images/icons/ster.png" alt="Ster">
      </button>
      <button @click="() => { category = 'Eten en Drinken'; type = 'bestek' }" :class="{ 'active':  type === 'bestek' }">
        <img src="@/assets/images/icons/bestek.png" alt="Bestek">
      </button>
    </div>
    <div>
      <label class="admin-label">Adres</label>
      <div style="position: relative;">
        <div id="route-map"></div>
      </div>
    </div>
    <div>
      <button class="admin-button admin-button-publish" @click="publish">Publiseer</button>
      <p class="admin-feedback" v-if="feedback">{{ feedback }}</p>
    </div>
  </div>
</template>

<script>
import mapbox from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import firebase from 'firebase/app'

export default {
  name: 'Location',
  data() {
    return {
      name: '',
      phone: '',
      site: '',
      address: '',
      coordinates: null,
      type: null,
      category: null,
      feedback: null,
      map: null,
      mapStyle: 'mapbox://styles/mapbox/outdoors-v10',
      geocoder: null,
      element: null
    }
  },
  methods: {
    publish() {
      if (
        this.name.trim() !== '' &&
        this.address.trim() !== '' &&
        this.category.trim() !== null
      ) {
        this.feedback = 'Gegevens uploaden..'
        const location = {
          name: this.name,
          phone: this.phone.trim() !== '' ? this.phone : null,
          site: this.site.trim() !== '' ? this.site : null,
          address: this.address,
          category: this.category,
          type: this.type,
          coordinates: this.coordinates
        }
        firebase.firestore().collection('locations').add(location).then(doc => {
          this.feedback = null
          this.$emit('close')
        }).catch(err => {
          console.log(err)
          this.feedback = 'Uploading mislukt.. Probeer opnieuw'
        })
      } else {
        this.feedback = 'Eerst alle velden invullen'
      }
    },
    setupMap() {
      this.element = document.createElement('div')
      this.element.className = this.type ? 'marker marker-' + this.type : 'marker marker-star'
      let marker = null

      this.geocoder.on('result', ev => {
        if (marker === null) {
          marker = new mapbox.Marker({ draggable: true, element: this.element })
            .setLngLat(ev.result.center)
            .addTo(this.map)

          marker.on('dragend', () => {
            const lngLat = marker.getLngLat()
            this.coordinates = { lng: lngLat.lng, lat: lngLat.lat}
          })
        } else {
          marker.setLngLat(ev.result.center)
        }
        this.coordinates = { lng: ev.result.center[0], lat: ev.result.center[1] }
        this.address = ev.result.place_name.replace(', Nederland', '')
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

    this.geocoder = new MapboxGeocoder({
      accessToken: mapbox.accessToken,
      mapboxgl: mapbox,
      marker: false
    })

    this.map.addControl(this.geocoder)
    this.map.on('load', () => this.setupMap())

    const pointInput = document.getElementById('point-input')
    this.setInputFilter(pointInput, value => /^[\d ]*$/.test(value))
  },
  watch: {
    type(newValue) {
      this.element.className = 'marker marker-' + newValue
    }
  }
}
</script>
