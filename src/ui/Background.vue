<template>
  <div>
    <!-- <materialPicker v-model="colors" @change-color="onColorChange" /> -->
  </div>
</template>

<script>
  var defaultProps = {
    hex: '#194d33',
    hsl: {
      h: 150,
      s: 0.5,
      l: 0.2,
      a: 1
    },
    hsv: {
      h: 150,
      s: 0.66,
      v: 0.30,
      a: 1
    },
    rgba: {
      r: 25,
      g: 77,
      b: 51,
      a: 1
    },
    a: 1
  }

  // var materialPicker = require('../../node_modules/vue-color/src/components/Sketch.vue')

  export default {
    name: 'editor-ui-background',
    props: ['value'],
    components: {
      // materialPicker: materialPicker
    },
    data: function() {
      return {
        colors: defaultProps
      }
    },
    methods: {
      onColorChange(evt) {
        this.$emit('input', evt.hex)
      }
    }
  }
</script>
