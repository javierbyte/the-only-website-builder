<template>
  <div class="editor-header">

    <div class="editor-block">
      <div class="editor-title">Title</div>
      <input class="input" type="text" v-model="element.data.title"/>

      <template v-if="element.data.title.length">
        <div class="editor-subtitle">Title Font size</div>
        <fontSize :defaultValue="'4rem'" v-model="element.data.titleStyle.fontSize" />
      </template>
    </div>

    <div class="editor-block">
      <div class="editor-title">Subtitle</div>
      <input class="input" type="text" v-model="element.data.subtitle"/>

      <template v-if="element.data.subtitle.length">
        <div class="editor-subtitle">Subtitle Font size</div>
        <fontSize :defaultValue="'1.4rem'" v-model="element.data.subtitleStyle.fontSize" />
      </template>
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Align</div>
      <textAlign v-model="element.data.style.textAlign" />
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Color</div>
      <colorPicker v-model="element.data.style.color" />
    </div>
    <div class="editor-block">
      <div class="editor-title">Background</div>
      <colorPicker v-model="element.data.style.backgroundColor" />
    </div>

    <div class="editor-block">
      <div class="editor-title">Block Size</div>
      <blockSize v-model="element.data.style.minHeight" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editor-header',
    props: ['element'],
    components: {
      fontSize: require('../../ui/FontSize.vue'),
      textAlign: require('../../ui/TextAlign.vue'),
      blockSize: require('../../ui/BlockSize.vue'),
      colorPicker: require('../../ui/ColorPicker.vue')
    }
  }
</script>
