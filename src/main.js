import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueHeadful from 'vue-headful'

Vue.component('Headful', VueHeadful)
Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')

ga('set', 'page', router.currentRoute.path);
ga('send', 'pageview');

router.afterEach(( to, from ) => {
  ga('set', 'page', to.path);
  ga('send', 'pageview');
});