<template>
  <div class="routes">
    <MainHeader />
    <div class="wrapper">
      <div class="route-list">
        <Item
          v-for="route in routes"
          :route="{...route, type}"
          :key="route.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/Header'
import Item from '@/components/Item'

export default {
  name: 'Routes',
  components: {
    MainHeader,
    Item
  },
  props: {
    routes: Array,
    type: String
  }
}
</script>
