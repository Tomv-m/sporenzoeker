import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import { homeRoute, isOranjenassau } from './global'

import RoutesHome from './views/Home.vue'
import RouteRoutes from './views/RouteRoutes.vue'
import RoutePage from './views/RoutePage.vue'
import SingleMap from './views/Map.vue'
import NotFound from '@/components/NotFound'

// admin
import Login from './views/Login.vue'
import Admin from './views/Admin.vue'

Vue.use(Router)

const routes = [
  {
    path: '/kaart',
    name: 'Map',
    component: SingleMap
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/login',
    name: 'Login',
    component: Login
  },
  {
    path: homeRoute,
    name: 'Home',
    component: RoutesHome
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
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

if (isOranjenassau) {
  const HomePage = require('./views/HomeOranjenassau')
  routes.push(
    { path: '/', name: 'HomePage', component: HomePage.default }
  )
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    if (firebase.auth().currentUser) {
      next()
    } else {
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router