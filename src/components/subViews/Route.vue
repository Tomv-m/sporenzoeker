<template>
  <div class="route-page">
    <Headful
      :title="'Sporenzoeker | ' + route.title"
      :image="image"
    />
    <header class="main-header">
      <div class="wrapper">
        <button 
          class="right-content route-page-button route-page-info"
          @click="attributionter = true"
        >
          i
        </button>
      </div>
    </header>
    <div class="route-page-bottom">
      <div class="wrapper">
        <div class="route-page-actions">
          <router-link
            :to="prevRoute ? prevRoute : '/'"
            class="route-page-button"
          >
            Terug naar routes
          </router-link>
          <button
            v-if="showUserLocationBtn"
            class="route-page-button"
            @click="locateUser"
          >
            Mijn locatie
          </button>
        </div>
        <div class="route-item route-item-small" :title="route.title">
          <div
            class="route-item-image"
            :style="{ 'background-image': 'url(' + image + ')' }"
          />
          <div class="route-item-info">
            <div class="route-item-info-top">
              <h2>{{ route.title }}</h2>
            </div>
            <div class="route-item-info-bottom">
              <div class="content">
                <span>{{ route.subTitle }}</span>
                <div class="divider"></div>
                <span>{{ visualType }}</span>
              </div>
              <div class="content-icon">
                <FietsIcon v-if="route.type === 'fietsen'" />
                <LoopIcon v-if="route.type === 'lopen'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <Modal v-if="selectedIcon" @close="selectedIcon = null">
        <div class="modal-info">
          <header>
            <h2>{{ selectedIcon.name }}</h2>
            <span>{{ selectedIcon.category }}</span>
          </header>
          <ul class="contact">
            <li>
              <span class="contact-info">Adres </span>{{ selectedIcon.address }}
            </li>
            <li v-if="selectedIcon.tel">
              <span class="contact-info">Telefoon </span>{{ selectedIcon.tel }}
            </li>
            <li v-if="selectedIcon.web">
              <span class="contact-info">Website </span><a target="_blank" :href="url(selectedIcon.web)">{{ selectedIcon.web }}</a>
            </li>
          </ul>
        </div>
      </Modal>
    </transition>
    <transition name="fade">
      <Modal v-if="attributionter" @close="attributionter = false">
        <ul class="map-footer">
          <li><a target="_blank" href="https://toerlezjoere.nl">&copy; Toerlezjoere</a></li>
          <li><a target="_blank" href="https://www.mapbox.com/about/maps/">&copy; Mapbox</a></li>
          <li><a target="_blank" href="http://www.openstreetmap.org/about/">&copy; OpenStreetMap</a></li>
          <li><a target="_blank" href="https://www.mapbox.com/map-feedback/"><b>Improve this map</b></a></li>
        </ul>
      </Modal>
    </transition>
    <div id="map"></div>
  </div>
</template>

<script>
import mapbox from 'mapbox-gl'
import FietsIcon from '@/components/icons/FietsIcon'
import LoopIcon from '@/components/icons/LoopIcon'
import Modal from '@/components/Modal'
// JSON
import iconsData from '@/data/icons'
// Icons
import ster from '@/assets/images/icons/ster.png';
import bestek from '@/assets/images/icons/bestek.png';
import klaver from '@/assets/images/icons/klaver.png';
import bed from '@/assets/images/icons/bed.png';
import tent from '@/assets/images/icons/tent.png';

export default {
  name: 'Route',
  components: {
    FietsIcon,
    LoopIcon,
    Modal
  },
  props: {
    route: Object,
    prevRoute: Object
  },
  computed: {
    visualType() {
      const type = this.route.type
      if (type === 'lopen') {
        return 'Wandelen'
      } else if (type === 'fietsen') {
        return 'Fietsen'
      } else {
        return ''
      }
    },
    routeData() {
      return require(`@/data/routes/${this.route.file}.json`)
    },
    image() {
      return require(`@/assets/images/items/${this.route.file}.jpg`)
    }
  },
  data() {
    return {
      map: null,
      accessToken: 'pk.eyJ1Ijoidi1tdG9tIiwiYSI6ImNqcm90dGN1ejBobWY0NHJxa3NnMnY5ODkifQ.8i5ISQiZx3iRP2nUNTznJg',
      mapStyle: 'mapbox://styles/mapbox/outdoors-v10',
      attributionter: false,
      selectedIcon: null,
      userPosition: null,
      userMarker: null,
      showUserLocationBtn: false,
      iconImages: [
        { img: ster, name: 'ster' },
        { img: bestek, name: 'bestek' },
        { img: klaver, name: 'klaver' },
        { img: bed, name: 'bed' },
        { img: tent, name: 'tent' },
      ],
      iconsData
    }
  },
  methods: {
    url(url) {
      if (!url.includes('http')) {
        url = 'http://'+url+'/'
      }
      return url
    },
    setRoute() {
      if (this.route.type === 'fietsen' && this.routeData.bikePoints) {
        this.setBikePoints()
      }
      const coordinates = this.routeData.coordinates
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
      // zoom to route
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord)
      }, new mapbox.LngLatBounds(coordinates[0], coordinates[0]))
      this.map.fitBounds(bounds, {
        zoom: this.routeData.zoom
      })
    },
    setBikePoints() {
      this.routeData.bikePoints.forEach(point => {
        let el = document.createElement('div');
        el.className = 'bike-point'
        el.innerHTML = point.name
        new mapbox.Marker(el)
          .setLngLat(point.coordinates)
          .addTo(this.map)
      })
    },
    locateUser() {
      window.navigator.geolocation.getCurrentPosition(pos => {
        this.userPosition = [pos.coords.longitude, pos.coords.latitude]
        this.showUserPoint()
        this.map.flyTo({
          center: this.userPosition,
          zoom: 14,
          essential: true
        });
      }, err => {
        if (err.code == err.PERMISSION_DENIED) {
          this.showUserLocationBtn = false
        }
      })
    },
    showUserPoint() {
      if (this.userMarker === null) {
        let el = document.createElement('div')
        el.className = 'user-point'
        this.userMarker = new mapbox.Marker(el)
          .setLngLat(this.userPosition)
          .addTo(this.map)
      } else {
        this.userMarker.setLngLat(this.userPosition)
      }
    },
    convertIconsToGeojson(icons) {
      let allIcons = []
      icons.forEach(sec => {
        const secIcons = sec.data.map(icon => {
          return {
            'type': 'Feature',
            'properties': {
              'category': sec.category,
              'icon': sec.subcategory,
              'info': icon.info
            },
            'geometry': {
              'type': 'Point',
              'coordinates': icon.coordinates
            }
          }
        })
        allIcons = [...allIcons, ...secIcons]
      })
      return {
        'type': 'FeatureCollection',
        'features': allIcons
      }
    },
    setIcons() {
      this.iconImages.forEach(img => this.addImage(img))
      this.map.addSource('places', {
        type: 'geojson',
        data: this.convertIconsToGeojson(this.iconsData)
      })
      this.map.addLayer({
        id: 'icons',
        type: 'symbol',
        source: 'places',
        layout: {
          'icon-image': '{icon}',
          'icon-size': 0.25,
          'icon-allow-overlap': false
        }
      })
      this.map.on('mouseenter', 'icons', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      })
      this.map.on('mouseleave', 'icons', () => {
        this.map.getCanvas().style.cursor = ''
      })
      this.map.on('click', 'icons', e => {
        this.selectedIcon = JSON.parse(e.features[0].properties.info)
      })
    },
    addImage(image) {
      this.map.loadImage(image.img, (err, img)  => {
        if (!err) {
          this.map.addImage(image.name, img)
        }
      })
    }
  },
  mounted() {
    if (window.navigator.geolocation) {
      this.showUserLocationBtn = true

      window.navigator.geolocation.getCurrentPosition(pos => {
        this.userPosition = [pos.coords.longitude, pos.coords.latitude]
        this.showUserPoint()
      }, err => {
        if (err.code == err.PERMISSION_DENIED) {
          this.showUserLocationBtn = false
        }
      })
    }
    
    mapbox.accessToken = this.accessToken
    this.map = new mapbox.Map({
      container: 'map',
      style: this.mapStyle,
      attributionControl: false,
      center: [4.9443857, 51.5416528],
      zoom: 10
    })

    this.map.on('load', () => {
      this.setIcons()
      this.setRoute()
    })
  }
}
</script>
