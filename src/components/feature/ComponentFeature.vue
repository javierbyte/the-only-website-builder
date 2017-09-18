<template>
  <div class="component-feature" :style="this.data.style">
    <div class="component-content">

      <div class="flex flex-wrap flex-justify-center component-expander">


      <div class="component-feature-el" v-for="feature in this.data.features">
        <div class="component-feature-el-icon icon" :class="feature.icon"></div>

        <h3 class="component-feature-el-title">
          {{feature.title}}
        </h3>

        <div class="component-feature-el-description">
          {{feature.description}}
        </div>
      </div>

    </div>


        
      </div>

  </div>
</template>

<script>
  export default {
    name: 'feature',
    props: ['data']
  }
</script>

<style>
  .component-feature .component-content{
    padding-top: 5vmin;
    padding-bottom: 5vmin;
  }

  .component-expander {
    margin: 0 -1rem;
  }

  .component-feature-el {
    flex: 1;
    text-align: center;
    padding: 1rem;

    min-width: 10rem;
    max-width: 20rem;
  }

  .component-feature-el-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
</style>
