<template>
  <div class="component-header" :style="this.data.style">
    <h1>
      {{data.title}}
    </h1>
  </div>
</template>

<script>
  export default {
    name: 'header',
    props: ['data']
  }
</script>

<style>
  .component-header {
    padding: 4rem;
  }
</style>
