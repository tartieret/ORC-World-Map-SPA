import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

import * as VueGoogleMaps from 'vue2-google-maps';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

import App from './App.vue'
import {
  routes
} from './routes.js';

Vue.config.productionTip = false

// Routing configuration
const router = new VueRouter({
  mode: 'history',
  routes: routes
});

// GoogleMap configuration
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAaDrnHGYtxU82dTPXnQFykjqBo9tbvZyI',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')