<template>
  <div v-if="routeFound">
    <Route
      v-if="!loading"
      :route="route"
      :prevRoute="from"
    />
  </div>
  <div v-else>
    <NotFound />
  </div>
</template>

<script>
import firebase from 'firebase/app'

import Route from '@/components/subViews/Route'
import NotFound from '@/components/NotFound'

export default {
  name: 'RoutePage',
  components: {
    Route,
    NotFound
  },
  data() {
    return {
      loading: true,
      from: null,
      route: null,
      routeFound: true
    }
  },
  methods: {
    getRoute() {
      firebase.firestore().collection('routes').doc(this.$route.params.slug2.toLowerCase()).get().then(doc => {
        const data = doc.data()
        if (doc.exists && data.group === this.$route.params.slug.toLowerCase()) {
          this.route = { id: doc.id, ...data }
        } else {
          this.routeFound = false
        }
        this.loading = false
      })
    }
  },
  created() {
    this.getRoute()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.from = from
    })
  },
}
</script>
