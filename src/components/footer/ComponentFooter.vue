<template>
  <div class="component-footer" :style="this.data.style">
    <div class="component-content">
      {{data.title}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'footer',
    props: ['data']
  }
</script>

<style>
  .component-footer .component-content{
    padding-top: 5vmin;
    padding-bottom: 5vmin;
  }

  .component-content {
    transition: font-size 0.2s, color 0.2s;
  }
</style>
