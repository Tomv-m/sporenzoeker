import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import RouteRoutes from './views/RouteRoutes.vue'
import RoutePage from './views/RoutePage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:slug',
      name: 'RouteRoutes',
      component: RouteRoutes
    },
    {
      path: '/:slug/:slug2',
      name: 'Route',
      component: RoutePage
    }
  ]
})
