<template>
  <div>
    <form @submit.prevent="addPoint" autocomplete="off">
      <input type="text" class="admin-input" id="point-input" v-model="pointValue" placeholder="Knooppunt nummer">
      <button>Toevoegen</button>
    </form>
    <button @click="undoLastPoint">Laatst toegevoegde punt verwijderen</button>
    <div id="bikepoint-map"></div>
  </div>
</template>

<script>
import mapbox from 'mapbox-gl'
import { v4 as uuid } from 'uuid'

import { isOranjenassau } from '../../global'

export default {
  name: 'BikepointMap',
  props: ['mapStyle'],
  data() {
    return {
      pointValue: '',
      bikePoints: [],
      map: null,
      markers: []
    }
  },
  methods: {
    setupBikepointMap() {
      this.map = new mapbox.Map({
        container: 'bikepoint-map',
        style: this.mapStyle,
        attributionControl: false,
        center: [4.9443857, 51.5416528],
        zoom: 10
      })
    },
    addPoint() {
      if (this.pointValue.trim() !== '') {
        let el = document.createElement('div');
        el.className = isOranjenassau ? 'route-point hex' : 'route-point'
        el.innerHTML = this.pointValue
        const mapCenter = this.map.getCenter()
        const markerId = uuid()
        const marker = new mapbox.Marker({ draggable: true, element: el })
          .setLngLat([mapCenter.lng, mapCenter.lat])
          .addTo(this.map)
        marker.on('dragend', () => {
          const markerIndex = this.markers.findIndex(marker => marker.id === markerId)
          const newCoordinates = marker.getLngLat()
          this.markers[markerIndex].coordinates = newCoordinates
        })
        this.markers.push({id: markerId, name: this.pointValue, coordinates: marker.getLngLat(), marker })
        this.pointValue = ''
      }
    },
    undoLastPoint() {
      if (this.markers.length > 0) {
        this.markers[this.markers.length - 1].marker.remove()
        this.markers.pop()
      }
    },
    setInputFilter(textbox, inputFilter) {
      ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
          if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty("oldValue")) {
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
    this.setupBikepointMap()
    const pointInput = document.getElementById('point-input')
    this.setInputFilter(pointInput, value => /^\d*$/.test(value))
  },
  watch: {
    markers(newValue) {
      const markerCoordinates = newValue.map(marker => { return { name: marker.name, coordinates: marker.coordinates } })
      this.$emit('input', markerCoordinates)
    }
  }
}
</script>