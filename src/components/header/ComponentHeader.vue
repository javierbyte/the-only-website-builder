<template>
  <div class="component-header" :style="this.data.style">
    <div class="component-content">
      <h1>
        {{data.title}}
      </h1>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'header',
    props: ['data']
  }
</script>

<style>
  .component-header .component-content{
    padding-top: 10vmin;
    padding-bottom: 10vmin;
    transition: font-size 0.2s;
  }
</style>
