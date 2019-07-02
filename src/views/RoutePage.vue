<template>
  <div v-if="route && subRoute">
    <Route
      :route="{...subRoute, type}"
      :prevRoute="from"
    />
  </div>
  <div v-else>
    <NotFound />
  </div>
</template>

<script>
import Route from '@/components/subViews/Route'
import NotFound from '@/components/NotFound'
// JSON
import routes from '@/data/routes'

export default {
  name: 'RoutePage',
  components: {
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
    },
    subRoute() {
      if (this.route.group.length > 0) {
        return this.route.group.find(route => {
          return route.slug === `${this.$route.params.slug}/${this.$route.params.slug2}`
        })
      }
      return null
    },
    type() {
      return this.route.type
    }
  }
}
</script>
