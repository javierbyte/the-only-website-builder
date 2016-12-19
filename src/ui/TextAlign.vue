<template>
  <div>
    <input type="radio" id="Left" value="left" :checked="value === 'left'" @click="onChange">
    <label for="Left">
      Left
    </label>
    <br>
    <input type="radio" id="Center" value="center" :checked="value === 'center'" @click="onChange">
    <label for="Center">Center</label>
    <br>
    <input type="radio" id="Right" value="right" :checked="value === 'right'" @click="onChange">
    <label for="Right">Right</label>
  </div>
</template>

<script>
  export default {
    name: 'editor-ui-fontsize',
    props: ['value'],
    methods: {
      onChange(evt) {
        this.$emit('input', evt.target.value)
      }
    }
  }
</script>
