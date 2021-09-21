import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3d6bd9a0 = () => interopDefault(import('../pages/dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _091a3ec0 = () => interopDefault(import('../pages/history.vue' /* webpackChunkName: "pages/history" */))
const _663f6b6f = () => interopDefault(import('../pages/staff/index.vue' /* webpackChunkName: "pages/staff/index" */))
const _6eaa8ebc = () => interopDefault(import('../pages/patient/new.vue' /* webpackChunkName: "pages/patient/new" */))
const _483f7d97 = () => interopDefault(import('../pages/staff/_id.vue' /* webpackChunkName: "pages/staff/_id" */))
const _a7d7ba44 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/dashboard",
    component: _3d6bd9a0,
    name: "dashboard"
  }, {
    path: "/history",
    component: _091a3ec0,
    name: "history"
  }, {
    path: "/staff",
    component: _663f6b6f,
    name: "staff"
  }, {
    path: "/patient/new",
    component: _6eaa8ebc,
    name: "patient-new"
  }, {
    path: "/staff/:id",
    component: _483f7d97,
    name: "staff-id"
  }, {
    path: "/",
    component: _a7d7ba44,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
