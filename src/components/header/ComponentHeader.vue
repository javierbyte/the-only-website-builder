<template>
  <div class="component-header" :style="this.data.style">
    <div class="component-content">
      <div :style="this.data.titleStyle">
        {{data.title}}
      </div>

      <div :style="this.data.subtitleStyle">
        {{data.subtitle}}
      </div>
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
  }

  .component-content > * {
    transition: font-size 0.2s;
  }
</style>
