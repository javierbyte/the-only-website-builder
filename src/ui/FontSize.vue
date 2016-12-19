<template>
  <div>
    {{value}}
    <input
      type="range"
      :min="minValue"
      :max="maxValue"
      :value="inputValue"
      id="fader"
      @input="onChangeValue"
      :step="stepValue">
  </div>
</template>

<script>
  export default {
    name: 'editor-ui-fontsize',
    props: ['value', 'defaultValue'],
    methods: {
      onChangeValue(evt) {
        this.$emit('input', evt.target.value + 'rem')
      }
    },
    computed: {
      minValue() {
        return parseFloat(this.defaultValue) / 2
      },
      maxValue() {
        return parseFloat(this.defaultValue) * 2
      },
      inputValue() {
        return parseFloat(this.value)
      },
      stepValue() {
        return parseFloat(this.defaultValue) / 10
      }
    }
  }
</script>
