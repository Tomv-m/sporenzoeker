<template>
  <div v-if="route">
    <Routes
      v-if="route.group" 
      :routes="route.group"
      :type="route.type"
    />
    <h1 v-if="!route.group">Doei</h1>
  </div>
  <div v-else>
    <p>Deze pagina zit niet op de route</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Routes from '@/components/subViews/Routes'

export default {
  name: 'RouteRoutes',
  components: {
    Routes
  },
  computed: {
    ...mapState(['routes']),
    route() {
      if (this.routes.length > 0) {
        const route = this.routes.find(route => {
          return route.slug === this.$route.params.slug
        })
        return route
      }
      return null
    }
  }
}
</script>
