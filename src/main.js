import Vue from "vue";
import App from "./App.vue";

import Sortable from 'sortablejs'

Vue.directive('sortable', {
  inserted: function (el, binding) {
    new Sortable(el, binding.value || {})
  }
})

new Vue({
	el: "#app",
	render: h => h(App)
});
