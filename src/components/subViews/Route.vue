<template>
  <div class="route-page">
    <Headful
      :title="'Sporen Zoeker | ' + route.title"
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
          <!-- TODO:
          <button class="route-page-button" >Mijn locatie</button> -->
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
          <li v-if="selectedIcon.tel !== 'null'">
            <span class="contact-info">Telefoon </span>{{ selectedIcon.tel }}
          </li>
          <li v-if="selectedIcon.web !== 'null'">
            <span class="contact-info">Website </span><a target="_blank" :href="url(selectedIcon.web)">{{ selectedIcon.web }}</a>
          </li>
        </ul>
      </div>
    </Modal>
    <Modal v-if="attributionter" @close="attributionter = false">
      <ul class="map-footer">
        <li><a target="_blank" href="https://toerlezjoere.nl">&copy; Toerlezjoere</a></li>
        <li><a target="_blank" href="https://www.mapbox.com/about/maps/">&copy; Mapbox</a></li>
        <li><a target="_blank" href="http://www.openstreetmap.org/about/">&copy; OpenStreetMap</a></li>
        <li><a target="_blank" href="https://www.mapbox.com/map-feedback/"><b>Improve this map</b></a></li>
      </ul>
    </Modal>
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
    image() {
      return require('@/assets/images/items/' + this.route.image)
    }
  },
  data() {
    return {
      map: null,
      accessToken: 'pk.eyJ1Ijoidi1tdG9tIiwiYSI6ImNqcm90dGN1ejBobWY0NHJxa3NnMnY5ODkifQ.8i5ISQiZx3iRP2nUNTznJg',
      mapStyle: 'mapbox://styles/mapbox/outdoors-v10',
      attributionter: false,
      selectedIcon: null,
      iconsData
    }
  },
  methods: {
    url(url) {
      if (!url.includes('http')) {
        url = 'http://'+url+'/'
      }
      return url
    }
  },
  mounted() {
    mapbox.accessToken = this.accessToken
    this.map = new mapbox.Map({
      container: 'map',
      style: this.mapStyle,
      attributionControl: false,
      center: [4.9443857, 51.5416528],
      zoom: 10
    })

    const icons = [
      { name: 'bed', img: require('@/assets/icons/bed.png') },
      { name: 'bestek', img: require('@/assets/icons/bestek.png') },
      { name: 'klaver', img: require('@/assets/icons/klaver.png') },
      { name: 'ster', img: require('@/assets/icons/ster.png') },
      { name: 'tent', img: require('@/assets/icons/tent.png') }
    ]

    this.map.on('load', () => {
      // Add route
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
              "coordinates": this.route.coordinates
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
      const coordinates = this.route.coordinates
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord)
      }, new mapbox.LngLatBounds(coordinates[0], coordinates[0]))
      this.map.fitBounds(bounds, {
        zoom: 13
      })
      
      // Add icons
      icons.forEach(icon => {
        this.map.loadImage(icon.img, (err, res) =>{
          this.map.addImage(icon.name, res)
        })
      })
      this.iconsData.forEach(section => {
        const geojson = {
          "id": section.id,
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": []
            }
          },
          "layout": {
            "icon-image": section.id,
            "icon-size": 0.28
          }
        }
        section.data.forEach(marker => {
          geojson.source.data.features.push({
            "type": "Feature",
            "properties": marker.info,
            "geometry": {
              "type": "Point",
              "coordinates": marker.coordinates
            }
          })
        })
        this.map.addLayer(geojson)

        this.map.on('click', section.id, e => {
          this.selectedIcon = { ...e.features[0].properties, category: section.category }
        })
        this.map.on('mouseenter', section.id, () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })
        this.map.on('mouseleave', section.id, () => {
          this.map.getCanvas().style.cursor = ''
        })
      })

    })
  }
}
</script>
