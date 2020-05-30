/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueHeadful from 'vue-headful'
import mapbox from 'mapbox-gl'

import firebase from 'firebase/app'
import '@/firebase'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

mapbox.accessToken = process.env.VUE_APP_MAPBOX_KEY

Vue.component('Headful', VueHeadful)
Vue.config.productionTip = false


firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})

ga('set', 'page', router.currentRoute.path);
ga('send', 'pageview');

router.afterEach(( to, from ) => { 
  ga('set', 'page', to.path);
  ga('send', 'pageview');
});