import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

import App from './App.vue'
import {
  routes
} from './routes.js';

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')