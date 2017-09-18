<template>
  <div class="module module-colorpicker">
    <div class="module-header touchable" @click="onModuleToggle">
      <div class="module-colorpicker-color" :style="{backgroundColor: value}"></div>
      <div class="module-header-title">
        {{value}}
      </div>
      <div class="module-header-toggle icon ti-angle-up" v-if="isModuleOpen"></div>
      <div class="module-header-toggle icon ti-angle-down" v-if="!isModuleOpen"></div>
    </div>

    <div class="module-content" v-if="isModuleOpen">
      <ColorPicker v-model="colors" @input="onColorChange" />
    </div>
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

  var ColorPicker = require('vue-color').Chrome

  export default {
    name: 'editor-ui-background',
    props: ['value'],
    components: {
      ColorPicker: ColorPicker
    },
    data: function() {
      return {
        colors: defaultProps,
        isModuleOpen: false
      }
    },
    methods: {
      onColorChange(evt) {
        console.log("new color", evt.hex)
        this.$emit('input', evt.hex)
      },
      onModuleToggle() {
        this.isModuleOpen = !this.isModuleOpen
      }
    }
  }
</script>

<style>
  .module {
    border-radius: 2px;
    background: #363642;
  }
  .module-header {
    border-radius: 2px;
    padding: 0.618rem 1rem;
    cursor: pointer;

    display: flex;
    align-items: center;
  }
  .module-header-title {
    flex: 1;
  }
  .module-header:hover {
    background: #43434f;
  }
  .module-content {
    padding: 0.618rem 1rem;
  }

  .module-colorpicker-color {
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 1.25rem;
    margin-right: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, rgba(0, 0, 0, 0.1) 0 1px 5px;
  }

  .vue-color__saturation--pointer, .vue-color__c-hue__pointer, .vue-color__c-alpha__pointer {
    color: transparent;
    background: #000;
    border: 1px solid #fff;
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 1rem;
    margin-left: -0.25rem;
    margin-top: -0.25rem;
  }
  .vc-chrome {
    width: 100% !important;
  }

  .vc-hue.vc-hue--horizontal {
    height: 14px;
    top: 7px;
  }
  .vc-hue-picker {
    top: 2px;
  }
  .vc-chrome-alpha-wrap {
    display: none;
  }
</style>
