<template>
  <div class="editor-header">

    <div class="editor-block">
      <div class="editor-title">Title</div>
      <input type="text" v-model="element.data.title"/>
    </div>

    <div class="editor-block">
      <div class="editor-title">Text Align</div>
      <input type="radio" id="Left" value="left" v-model="element.data.style.textAlign">
      <label for="Left">
        Left
      </label>
      <br>
      <input type="radio" id="Center" value="center" v-model="element.data.style.textAlign">
      <label for="Center">Center</label>
      <br>
      <input type="radio" id="Right" value="right" v-model="element.data.style.textAlign">
      <label for="Right">Right</label>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'editor-header',
    props: ['element']
  }
</script>
