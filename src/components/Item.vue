<template>
  <router-link
    class="route-item route-item-normal"
    :to="route.slug"
    :title="route.title"
  >
    <div
      class="route-item-image"
      :style="{ 'background-image': 'url(' + getImage(route.file) + ')' }"
    />
    <div class="route-item-info">
      <div class="route-item-info-top">
        <h2>{{ route.title }}</h2>
      </div>
      <div class="route-item-info-bottom">
        <div class="content">
          <span v-if="route.subTitle">{{ route.subTitle }}</span>
          <div v-if="route.subTitle" class="divider"></div>
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
      if (this.route.group) {
        const groupType = this.route.type === 'lopen' ? 'wandelingen' : 'fietsroutes'
        return this.route.group.length + ' ' + groupType
      } else {
        return this.route.type === 'lopen' ? 'Wandelen' : 'Fietsen'
      }
    }
  },
  methods: {
    getImage(img) {
      return require(`@/assets/images/items/${img}.jpg`)
    }
  }
}
</script>
