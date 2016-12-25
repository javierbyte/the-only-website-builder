import Vue from 'vue'
import App from './App.vue'

import Sortable from 'vue-sortable'

Vue.use(Sortable)

new Vue({
  el: '#app',
  render: h => h(App)
})
