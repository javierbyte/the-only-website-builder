<template>
  <div class="editor-footer">

    <div class="editor-block">
      <div class="editor-title">Text</div>
      <input type="text" v-model="element.data.text"/>
    </div>

    <div class="editor-block" v-if="element.data.text.length">
      <div class="editor-title">Font Size</div>
      <fontSize :defaultValue="'1rem'" v-model="element.data.style.fontSize" />
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Align</div>
      <textAlign v-model="element.data.style.textAlign">
    </div>

  </div>
</template>

<script>
  export default {
    name: 'editor-footer',
    props: ['element'],
    components: {
      fontSize: require('../../ui/FontSize.vue'),
      textAlign: require('../../ui/TextAlign.vue')
    }
  }
</script>
