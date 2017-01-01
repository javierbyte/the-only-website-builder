<script>
  export default {
    name: 'editor-ui-blockSize',
    props: ['value'],
    components: {
      optionSelect: require('./OptionSelect.vue'),
    },
    data() {
      return {
        kBlockSizeOptions: {
          '0': 'Auto',
          '61.8vh': 'Big',
          '100vh': 'Full'
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
  <optionSelect :options="kBlockSizeOptions" :value="value" @input="onChange"/>
</template>

