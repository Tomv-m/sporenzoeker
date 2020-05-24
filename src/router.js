import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import { routePrefix, isOranjenassau } from './global'

import Home from './views/Home.vue'
import RouteRoutes from './views/RouteRoutes.vue'
import RoutePage from './views/RoutePage.vue'
import SingleMap from './views/Map.vue'

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
    path: `${routePrefix}/`,
    name: 'Home',
    component: Home
  },
  {
    path: `${routePrefix}/:slug`,
    name: 'RouteRoutes',
    component: RouteRoutes
  },
  {
    path: `${routePrefix}/:slug/:slug2`,
    name: 'Route',
    component: RoutePage
  }
]

if (isOranjenassau) {
  routes.push(
    { path: '/', redirect: `${routePrefix}` }
  )
}

console.log(routes)

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