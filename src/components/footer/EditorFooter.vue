<template>
  <div class="editor-footer">
    <div class="editor-block">
      <div class="editor-title">Text</div>
      <input class="input" type="text" v-model="element.data.title"/>
    </div>

    <div class="editor-block" v-if="element.data.title.length">
      <div class="editor-title">Font Size</div>
      <fontSize :defaultValue="'1rem'" v-model="element.data.style.fontSize" />
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Align</div>
      <textAlign v-model="element.data.style.textAlign">
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Color</div>
      <colorPicker v-model="element.data.style.color" />
    </div>

    <div class="editor-block">
      <div class="editor-title">Background</div>
      <colorPicker v-model="element.data.style.backgroundColor" />
    </div>

  </div>
</template>

<script>
  export default {
    name: 'editor-footer',
    props: ['element'],
    components: {
      fontSize: require('../../ui/FontSize.vue'),
      textAlign: require('../../ui/TextAlign.vue'),
      colorPicker: require('../../ui/ColorPicker.vue')
    }
  }
</script>
