<template>
  <div class="main">

    <div class="sidebar" :class="{'-open': editorStatus.editingActive}">
      <div class="sidebar-content">
        <div class="sidebar-constructor">
          <div class="sidebar-header">
            Build your website!
          </div>
          <div class="constructor-container flex-1">
            <template v-for="web in webdata">
              <div @click="onEditElement(web.uuid)" class="constructor-element" :key="web.uuid">
                <div class="constructor-element-content">{{web.type}}</div>
              </div>
            </template>
          </div>
        </div><!-- /sidebar-constructor -->

        <div class="sidebar-editor" v-if="webdata.length">
          <div class="sidebar-header">
            Editing {{activeEditingElement.type}}
          </div>

          <div class="p-1">
            <div :is="'editor-' + activeEditingElement.type.toLowerCase()" :element="activeEditingElement">
            </div>
          </div>

          <button @click="onCancelEditing">
            Go back
          </button>
        </div><!-- /sidebar-editor -->
      </div><!-- /sidebar-content -->
    </div><!-- /sidebar -->

    <div class="viewerresults">
      <div
        class="component"
        v-for="web in webdata"
        :key="web.uuid"
        :is="'viewer-' + web.type.toLowerCase()"
        :data="web.data">
      </div>
    </div>
  </div>
</template>

<script>
const _ = require('lodash')
const uuidV1 = require('uuid/v1')

const ROOM = window.location.search.split('?room=')[1] || uuidV1()

history.pushState({}, null, `?room=${ROOM}`);

var socket = {}
if (window.io) {
  if (window.location.hostname !== 'localhost:8080') {
    console.log('Connecting javierbyte socket')
    socket = io.connect('http://javierbyte.com:8124')
  } else {
    console.log('Connecting javierbyte socket')
    socket = io.connect('http://localhost:8124')
  }
} else {
  socket = {
    on: () => {console.log(arguments)},
    emit: () => {console.log(arguments)}
  }
}

var preventUpdate = false

const app = {
  name: 'app',
  created() {
    socket.emit('JOINROOM', ROOM)

    socket.on('UPDATE', newWebData => {
      this.$set(this, 'webdata', newWebData)
      preventUpdate = true
    })
  },
  watch: {
    webdata: {
      handler(newWebData) {
        if (preventUpdate) {
          preventUpdate = false
          return
        }

        socket.emit('UPDATE', {
          room: ROOM,
          webdata: newWebData
        })
      },
      deep: true
    }
  },
  methods: {
    updated() {
      console.warn('\n\n\naspojasd')
    },
    onEditElement(uuid) {
      console.log('Enter edit mode', uuid)
      this.editorStatus.editingActive = true
      this.editorStatus.editingElement = uuid
    },
    onCancelEditing() {
      console.log('Leave edit mode')
      this.editorStatus.editingActive = false
    }
  },
  computed: {
    activeEditingElement() {
      return _.find(this.webdata, {
        uuid: this.editorStatus.editingElement
      })
    }
  },
  components: {
    'viewer-header': require('./components/header/ComponentHeader.vue'),
    'editor-header': require('./components/header/EditorHeader.vue'),

    'viewer-footer': require('./components/footer/ComponentFooter.vue'),
    'editor-footer': require('./components/footer/EditorFooter.vue'),
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      editorStatus: {
        editingActive: false,
        editingElement: 0
      },
      webdata: []
    }
  }
}

export default app

</script>

<style>
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  * {
    position: relative;
    margin: 0;
    padding: 0;
  }
  body {
    background: #fff;
  }

  body, input, textarea, button {
    font-family: -apple-system, BlinkMacSystemFont, Segoe IO, Roboto, sans-serif;
    font-weight: 300;
    font-size: 15px;
    line-height: 1.618;
  }

  b, h1, h2, h3, strong {
    font-weight: 600;
  }

  .main {
    display: flex;
  }

  .sidebar {
    width: 20rem;
    height: 100vh;
    background: #ECF0F1;
    box-shadow: inset -2px 0 3px -2px #BDC3C7;
    overflow-x: hidden;
  }
  .sidebar-content {
    transition: transform 0.3s;
  }
  .sidebar.-open .sidebar-content {
    transform: translatex(-20rem);
  }
  .sidebar-constructor {
    width: 20rem;
    position: absolute;
  }
  .sidebar-editor {
    width: 20rem;
    position: absolute;
    left: 20rem;
  }

  .sidebar-header {
    padding: 1rem;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.07) 0 1px 0, rgba(0, 0, 0, 0.07) 0 2px 5px;
    font-weight: 500;
  }

  .editor {}
  .editor-block {
    padding-bottom: 2rem;
  }
  .editor-title {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.8rem;
    padding-bottom: 0.309rem;
  }

  .constructor-element {
    padding: 1rem 1rem 0;
    cursor: pointer;
  }
  .constructor-element-content {
    padding: 1rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .constructor-element-content:hover {
    box-shadow: rgba(0, 0, 0, 0.05) 0 1px 0, rgba(0, 0, 0, 0.1) 0 2px 8px;
  }

  .constructor-add {
    border-radius: 2px;
    padding: 1rem;
    background: #BDC3C7;
    margin: 1rem;
    cursor: pointer;
    text-align: center;
  }

  .viewerresults {
    flex: 1px;
  }

  button {
    border: 0;
    margin: 1rem;
    padding: 1rem;
    background: #2980B9;
    color: #fff;
    cursor: pointer;
    line-height: 1;
    border-radius: 2px;
    display: block;
  }
  button.-light {
    background: #BDC3C7;
    color: #2C3E50;
  }
  input {
    line-height: 1;
    padding: 0.618rem 1rem;
    border: 0;
    display: block;
    border-radius: 2px;
    width: 100%;
    border: 1px solid #BDC3C7;
  }
  input[type='radio'] {
    margin: 0.5rem 0;
    display: inline-block;
    width: auto;
  }
  label {
    display: inline-block;
    vertical-align: middle;
    padding-left: 0.25rem;
  }
  button:hover {
    background: #3498DB;
  }
  button:active {
    outline: none;
    background: #34495E;
  }

  .component-content {
    max-width: 960px;
    margin: 0 auto;
    padding-left: 5vmin;
    padding-right: 5vmin;
  }

  .p-1 {
    padding: 1rem;
  }
  .flex-1 {
    flex: 1;
  }
</style>
