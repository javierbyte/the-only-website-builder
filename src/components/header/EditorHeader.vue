<template>
  <div class="editor-header">

    <div class="editor-block">
      <div class="editor-title">Title</div>
      <input type="text" v-model="element.data.title"/>
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Align</div>
      <textAlign v-model="element.data.style.textAlign">
    </div>

    <div class="editor-block">
      <div class="editor-title">Font size</div>
      <fontSize :defaultValue="'2rem'" v-model="element.data.style.fontSize" />
    </div>

  </div>
</template>

<script>
  export default {
    name: 'editor-header',
    props: ['element'],
    components: {
      fontSize: require('../../ui/FontSize.vue'),
      textAlign: require('../../ui/TextAlign.vue')
    }
  }
</script>
