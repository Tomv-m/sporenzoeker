<template>
  <div class="home">
    <Headful
      :title="`${siteName} | Home`"
      :description="siteDesc"
    />
    <MainHeader>
      <button
        class="icon-button"
        :class="{ active: filter === 'fietsen' }"
        @click="setFilter('fietsen')"
      >
        <FietsIcon />
      </button>
      <button
        class="icon-button"
        :class="{ active: filter === 'lopen' }"
        @click="setFilter('lopen')"
      >
        <LoopIcon />
      </button>
    </MainHeader>
    <div class="wrapper">
      <form @submit.prevent="searchItems" class="search-wrapper">
        <input type="text" v-model="search" placeholder="Opzoek naar sporen?">
        <button class="search-button">
          <SearchIcon/>
        </button>
      </form>
      <div class="route-list">
        <div class="route-list-loading" v-if="loading">
          <Loader background="#008D36" color="#008D36" />
        </div>
        <Item
          v-else
          v-for="route in allRoutes"
          :route="route"
          :key="route.id"
        />
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { ScaleOut as Loader } from 'vue-loading-spinner'

import { siteName, siteDesc, routesCollection } from '../global'

import MainHeader from '@/components/Header'
import MainFooter from '@/components/Footer'
import Item from '@/components/Item'
// Icons
import LoopIcon from '@/components/icons/LoopIcon'
import FietsIcon from '@/components/icons/FietsIcon'
import SearchIcon from '@/components/icons/SearchIcon'

export default {
  name: 'home',
  components: {
    Loader,
    MainHeader,
    MainFooter,
    LoopIcon,
    FietsIcon,
    SearchIcon,
    Item
  },
  data() {
    return {
      loading: true,
      filter: null,
      search: '',
      routes: [],
      siteName,
      siteDesc
    }
  },
  computed: {
    filtered() {
      let routes = this.routes
      if (this.filter) {
        routes = this.routes.filter(route => {
          return route.type === this.filter
        })
      }
      return routes
    },
    allRoutes() {
      if (this.search.trim() === '') {
        return this.filtered
      } else {
        return this.filtered.filter(route => {
          return route.name.toLowerCase().includes(this.search.trim().toLowerCase())
        })
      }
    }
  },
  methods: {
    getRoutes() {
      const routesRef = firebase.firestore().collection(routesCollection).where('group', '==', null)
      routesRef.get().then(snapshot => {
        let routes = []
        snapshot.forEach(doc => {
          routes.push({ id: doc.id, ...doc.data() })
        })
        routes.sort((x, y) => x.order - y.order)
        this.routes = routes
        this.loading = false
      })
    },
    setFilter(value) {
      if (this.filter === value) {
        this.filter = null
      } else {
        this.filter = value
      }
    },
    searchItems() {
      if (this.allRoutes <! 0) {
        this.search = ''
      }
    }
  },
  created() {
    this.getRoutes()
  }
}
</script>
