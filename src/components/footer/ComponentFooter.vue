<template>
  <div class="component-footer" :style="this.data.style">
    <div class="component-content">
      {{data.text}}
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
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .component-content > * {
    transition: font-size 0.2s;
  }
</style>
