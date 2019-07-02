<template>
  <div v-if="route">
    <Routes
      v-if="route.group" 
      :group="route"
    />
    <Route
      v-else
      :route="route"
      :prevRoute="from"
    />
  </div>
  <NotFound v-else/>
</template>

<script>
import Routes from '@/components/subViews/Routes'
import Route from '@/components/subViews/Route'
import NotFound from '@/components/NotFound'
// JSON
import routes from '@/data/routes'

export default {
  name: 'RouteRoutes',
  components: {
    Routes,
    Route,
    NotFound
  },
  data() {
    return {
      from: null,
      routes
    }
  },
  beforeRouteEnter(to, from, next) {
      next((vm) => {
          vm.from = from
      })
  },
  computed: {
    route() {
      if (this.routes.length > 0) {
        return this.routes.find(route => {
          return route.slug === this.$route.params.slug
        })
      }
      return null
    }
  }
}
</script>
