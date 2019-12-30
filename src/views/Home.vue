<template>
  <div class="home">
    <Headful
      title="Sporen Zoeker | Home"
      description="Ontdek met Sporenzoeker de Toerlezjoere-regio tussen Breda, Tilburg en de Belgische grens. Je vind hier onze favoriete fiets- en wandelroutes. Ervaar onderweg de omgeving, ontdek verrassende uitstapjes en geniet van een lekkere hap tussendoor of een heerlijk diner. Liever zonder telefoon erop uit? Verken het gebied met de brochure verkrijgbaar bij de leden van Toerlezjoere, deze zijn te vinden op de plattegrond en herkenbaar aan het schildje op de gevel. Beleef Toerlezjoere, ’t goeie van Brabant…"
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
        <input type="text" v-model="search" placeholder="Zoek jouw spoor..">
        <button class="search-button">
          <SearchIcon/>
        </button>
      </form>
      <div class="route-list">
        <Item
          v-for="route in allRoutes"
          :route="route"
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
// JSON
import routes from '@/data/routes'
// Icons
import LoopIcon from '@/components/icons/LoopIcon'
import FietsIcon from '@/components/icons/FietsIcon'
import SearchIcon from '@/components/icons/SearchIcon'

export default {
  name: 'home',
  components: {
    MainHeader,
    MainFooter,
    LoopIcon,
    FietsIcon,
    SearchIcon,
    Item
  },
  data() {
    return {
      filter: null,
      search: '',
      routes
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
          return route.title.toLowerCase().includes(this.search.trim().toLowerCase())
        })
      }
    }
  },
  methods: {
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
  }
}
</script>
