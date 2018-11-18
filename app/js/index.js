import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import store from './store'

import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify, {})
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  el: '#container',
  router,
  store,
  render: function (h) {
	return h(App);
  }
})