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

import { routesCollection } from '../global'

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
      const slug = this.$route.params.slug.toLowerCase()
      const slug2 = this.$route.params.slug2.toLowerCase()
      firebase.firestore().collection(routesCollection).where('group', '==', slug).where('slug', '==', slug2).get().then(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          this.route = { id: doc.id, ...doc.data() }
        } else {
          this.routeFound = false
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.routeFound = false
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
