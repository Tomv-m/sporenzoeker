<template>
  <div class="home">
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
        <button class="search-button" type="submit">
          <SearchIcon/>
        </button>
      </form>
      <div class="route-list" v-if="searched">
        <Item
          v-for="route in searched"
          :route="route"
          :key="route.id"
        />
      </div>
      <div class="route-list" v-else>
        <Item
          v-for="route in filtered"
          :route="route"
          :key="route.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainHeader from '@/components/Header'
import Item from '@/components/Item'

// Icons
import LoopIcon from '@/components/icons/LoopIcon'
import FietsIcon from '@/components/icons/FietsIcon'
import SearchIcon from '@/components/icons/SearchIcon'

export default {
  name: 'home',
  components: {
    MainHeader,
    LoopIcon,
    FietsIcon,
    SearchIcon,
    Item
  },
  data() {
    return {
      filter: null,
      search: '',
      searched: null
    }
  },
  computed: {
    ...mapState(['routes']),
    filtered() {
      let routes = this.routes
      if (this.filter) {
        routes = this.routes.filter(route => {
          return route.type === this.filter
        })
      }
      return routes
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
      if (this.search.trim() !== '') {
        const search = this.search.trim().toLowerCase()
        this.searched = this.filtered.filter(route => {
          return route.title.toLowerCase().includes(search)
        })
      } else {
        this.searched = null
      }
    }
  }
}
</script>
