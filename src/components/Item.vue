<template>
  <router-link
    class="route-item route-item-normal"
    :to="`${routePrefix}/${route.id}`"
    :title="route.name"
  >
    <div
      class="route-item-image"
      :style="{ 'background-image': 'url(' + coverImage + ')' }"
    />
    <div class="route-item-info">
      <div class="route-item-info-top">
        <h2>{{ route.name }}</h2>
      </div>
      <div class="route-item-info-bottom">
        <div class="content">
          <span v-if="route.subtitle">{{ route.subtitle }}</span>
          <span v-else-if="route.distance">{{ parseFloat(route.distance).toFixed(2) }} km</span>
          <div v-if="route.subtitle || route.distance" class="divider"></div>
          <span>{{ type }}</span>
        </div>
        <div class="content-icon">
          <FietsIcon v-if="route.type === 'fietsen'" />
          <LoopIcon v-if="route.type === 'lopen'" />
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import firebase from 'firebase/app'

import { routePrefix } from '../global'

import FietsIcon from '@/components/icons/FietsIcon'
import LoopIcon from '@/components/icons/LoopIcon'

export default {
  name: 'Item',
  components: {
    FietsIcon,
    LoopIcon
  },
  props: {
    route: Object
  },
  computed: {
    type() {
      if (!this.route.data) {
        return this.route.type === 'lopen' ? 'Wandelingen' : 'Fietsroutes'
      } else {
        return this.route.type === 'lopen' ? 'Wandelen' : 'Fietsen'
      }
    }
  },
  data() {
    return {
      coverImage: '',
      routePrefix
    }
  },
  methods: {
     getImage() {
      const storage = firebase.storage()
      const url = storage.ref(this.route.coverImage).getDownloadURL().then(url => {
        this.coverImage = url
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getImage()
  }
}
</script>
