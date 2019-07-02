<template>
  <router-link
    class="route-item route-item-normal"
    :to="route.slug"
    :title="route.title"
  >
    <div
      class="route-item-image"
      :style="{ 'background-image': getImage(route.image) }"
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
    visualType() {
      const type = this.route.type
      if (type === 'lopen') {
        return 'Wandelen'
      } else if (type === 'fietsen') {
        return 'Fietsen'
      } else {
        return ''
      }
    }
  },
  methods: {
    getImage(img) {
      return 'url('+require('@/assets/images/items/'+img)+')'
    }
  }
}
</script>
