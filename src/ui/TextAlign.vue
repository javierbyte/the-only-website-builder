<script>
  export default {
    name: 'editor-ui-fontsize',
    props: ['value'],
    components: {
      optionSelect: require('./OptionSelect.vue'),
    },
    data() {
      return {
        kTextAlignOptions: {
          left: 'Left',
          center: 'Center',
          right: 'Right'
        }
      }
    },
    methods: {
      onChange(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
</script>

<template>
  <optionSelect :options="kTextAlignOptions" :value="value" @input="onChange"/>
</template>

