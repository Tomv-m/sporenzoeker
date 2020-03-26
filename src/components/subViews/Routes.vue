<template>
  <div class="routes">
    <Headful
      :title="'Sporenzoeker | ' + group.title"
      :image="image"
    />
    <MainHeader />
    <div class="wrapper">
      <div class="routes-header">
        <div 
          class="routes-header-image"
          :style="{ 'background-image': 'url(' + image + ')' }"
        >
          <h1>{{ group.title }}</h1>
        </div>
        <span v-if="group.subTitle">{{ group.subTitle }}</span>
      </div>
      <div class="route-list">
        <Item
          v-for="route in group.group"
          :route="{ ...route, type }"
          :key="route.slug"
        />
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script>
import MainHeader from '@/components/Header'
import MainFooter from '@/components/Footer'
import Item from '@/components/Item'

export default {
  name: 'Routes',
  components: {
    MainHeader,
    MainFooter,
    Item
  },
  props: {
    group: Object
  },
  computed: {
    type() {
      return this.group.type
    },
    image() {
      return require(`@/assets/images/groups/${this.group.file}.jpg`)
    }
  }
}
</script>
