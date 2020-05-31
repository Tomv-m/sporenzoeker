<template>
  <div class="routes">
    <Headful
      :title="`${siteName} | ${group.name}`"
      :image="headerImage"
    />
    <MainHeader />
    <div class="wrapper">
      <div class="routes-header">
        <div 
          class="routes-header-image"
          :style="{ 'background-image': 'url(' + headerImage + ')' }"
        >
          <h1>{{ group.name }}</h1>
        </div>
        <span v-if="group.subtitle">{{ group.subtitle }}</span>
      </div>
      <div class="route-list">
        <div class="route-list-loading" v-if="loading">
          <Loader background="#008D36" color="#008D36" />
        </div>
        <Item
          v-else
          v-for="route in routes"
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

import { siteName } from '../../global'

import MainHeader from '@/components/Header'
import MainFooter from '@/components/Footer'
import Item from '@/components/Item'
import { routesCollection } from '../../global'

export default {
  name: 'Routes',
  components: {
    Loader,
    MainHeader,
    MainFooter,
    Item
  },
  props: {
    group: Object
  },
  data() {
    return {
      loading: true,
      routes: [],
      headerImage: '',
      siteName
    }
  },
  methods: {
    getRoutes() {
      const routesRef = firebase.firestore().collection(routesCollection).where('group', '==', this.group.id)
      routesRef.get().then(snapshot => {
        let routes = []
        snapshot.forEach(doc => {
          const { slug } = doc.data()
          routes.push({ id: doc.id, ...doc.data(), slug: `${this.group.slug}/${slug}` })
        })
        this.routes = routes
        this.loading = false
      })
    },
    getImage() {
      const storage = firebase.storage()
      storage.ref(this.group.headerImage).getDownloadURL().then(url => {
        this.headerImage = url
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getRoutes()
    this.getImage()
  }
}
</script>
