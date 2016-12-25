<template>
  <div class="main">

    <div class="sidebar" :class="{'-open': editorStatus.editingActive}">
      <div class="sidebar-content">
        <div class="sidebar-constructor">
          <div class="sidebar-header">
            Build your website!
          </div>
          <div class="constructor-container flex-1" v-sortable="{onUpdate: onUpdateOrder}">
            <div v-for="web in webdata" :key="web.uuid">
              <div @click="onEditElement(web.uuid)" class="constructor-element">
                <div class="constructor-element-content">{{web.type}}</div>
              </div>
              <div class="constructor-element-delete" @click="onDeleteElement(web.uuid)">
                <div class="icon icon-minus"></div>
              </div>
            </div>
          </div>

          <div class="constructor-add">
            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              +Header
            </div>
            <div class="constructor-add-element" @click="onAddElement('FOOTER')">
              +Footer
            </div>
          </div>
        </div><!-- /sidebar-constructor -->

        <div class="sidebar-editor" v-if="webdata.length && activeEditingElement">
          <div class="sidebar-header" :key="activeEditingElement.uuid">
            Editing {{activeEditingElement.type}}

            <div class="sidebar-header-back" @click="onCancelEditing">
              <div class="icon icon-chevron-left"></div>
            </div>
          </div>

          <div class="p-1">
            <div
              :is="'editor-' + activeEditingElement.type.toLowerCase()"
              :element="activeEditingElement">
            </div>
          </div>

          <button @click="onCancelEditing" class="inline-block">
            <div class="icon icon-chevron-left"></div> Go back
          </button>
          <button @click="onDeleteElement(activeEditingElement.uuid)" class="-danger inline-block">
            <div class="icon icon-minus"></div> Delete
          </button>
        </div><!-- /sidebar-editor -->
      </div><!-- /sidebar-content -->
    </div><!-- /sidebar -->

    <transition-group class="viewerresults" name="flip-list" tag="div">
      <div
        class="component"
        v-for="web in webdata"
        :key="web.uuid"
        :is="'viewer-' + web.type.toLowerCase()"
        :data="web.data"
        @click="onEditElement(web.uuid)">
      </div>
    </transition-group>
  </div>
</template>

<script>
const _ = require('lodash')
const uuidV1 = require('uuid/v1')

const ROOM = window.location.search.split('?room=')[1] || uuidV1()

history.pushState({}, null, `?room=${ROOM}`);

var socket = {}
if (window.location.hostname !== 'localhost') {
  console.info('Connecting javierbyte socket')
  socket = io.connect('http://javierbyte.com:8124')
} else {
  console.info('Connecting localhost socket')
  socket = io.connect('http://localhost:8124')
}

var preventUpdate = false

var throttledWebdataHandler = _.throttle((newWebData) => {
  if (preventUpdate) {
    preventUpdate = false
    console.info('PREVENTED UPDATE')
    return
  }
  socket.emit('UPDATE', {
    room: ROOM,
    webdata: newWebData
  })
}, 64)

function getDefault(type) {
  var kTypes = {
    HEADER: {
      type: 'HEADER',
      meta: {
        active: true
      },
      data: {
        title: 'Header title',
        subtitle: '',
        style: {
          backgroundColor: '#222',
          color: '#fff',
          textAlign: 'center'
        },
        titleStyle: {
          fontSize: '4rem',
          fontWeight: 500
        },
        subtitleStyle: {
          fontSize: '1.4rem',
          fontWeight: 300,
          opacity: 0.85
        }
      }
    },
    FOOTER: {
      type: 'FOOTER',
      meta: {
        active: true
      },
      data: {
        text: '©2016 Footer Text',
        style: {
          backgroundColor: '#eee',
          color: '#666',
          textAlign: 'left',
          fontSize: '1rem'
        }
      }
    }
  }

  return _.assign({}, _.cloneDeep(kTypes[type]), {
    uuid: new Date().getTime()
  })
}

const app = {
  name: 'app',
  created() {
    socket.emit('JOINROOM', ROOM)

    socket.on('UPDATE', newWebData => {
      if (_.isEqual(newWebData, this.webdata)) {
        console.log('Prevented for equality', newWebData)
      }
      console.info('UPDATE FROM SOCKET', newWebData)
      preventUpdate = true
      this.$set(this, 'webdata', newWebData)
    })
  },
  watch: {
    webdata: {
      handler: throttledWebdataHandler,
      deep: true
    }
  },
  methods: {
    onUpdateOrder(evt) {
      this.webdata.splice(evt.newIndex, 0, this.webdata.splice(evt.oldIndex, 1)[0])
    },
    onEditElement(uuid) {
      console.log('Enter edit mode', uuid)
      this.editorStatus.editingActive = true
      this.editorStatus.editingElement = uuid
    },
    onDeleteElement(uuid) {
      console.info('DELETE', uuid)
      this.editingElement = null
      this.editorStatus.editingActive = false
      this.$set(this, 'webdata', this.webdata.filter(el => {
        return el.uuid !== uuid
      }))
    },
    onCancelEditing() {
      console.info('Leave edit mode')
      this.editorStatus.editingActive = false
    },
    onAddElement(type) {
      console.info('ADD', this.webdata)
      this.webdata.push(getDefault(type))
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
    background: #353535;
    overflow-x: hidden;
    color: #9e9e9e;
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
    height: 2.618rem;
    line-height: 2.618rem;
    text-align: center;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.8rem;
    background: #3f3f3f;
    color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, rgba(0, 0, 0, 0.1) 0 1px 3px;
  }
  .sidebar-header-back {
    height: 2.618rem;
    line-height: 2.618rem;
    width: 4rem;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    color: #999;
    cursor: pointer;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
  }
  .sidebar-header-back:hover {
    color: #fff;
  }

  .editor {}
  .editor-block {
    padding-bottom: 2rem;
  }
  .editor-title {
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.8rem;
    padding-bottom: 0.309rem;
  }

  .constructor-element {
    padding: 1rem 1rem 0;
    cursor: pointer;
  }
  .constructor-element-delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 1.5rem;
    background: #666;
    text-align: center;
    color: #ddd;
    display: block;
    font-size: 0.8rem;
    cursor: pointer;
    font-weight: 600;
  }
  .icon {
    display: inline-block;
    top: -1px;
  }
  .icon::before {
    vertical-align: middle;
    display: inline-block;
  }
  .constructor-element-delete:hover {
    background: #e00;
    color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, rgba(0, 0, 0, 0.1) 0 1px 3px;
  }
  .constructor-element-content {
    padding: 1rem;
    background: #e0e1e2;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
  }
  .constructor-element-content:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 0, rgba(0, 0, 0, 0.2) 0 2px 8px;
    background: #fff;
    color: #000;
  }

  .constructor-add {
    padding: 1rem;
    display: flex;
  }
  .constructor-add-element {
    flex: 1;
    line-height: 2rem;
    height: 2rem;
    padding: 0 1rem;
    background: #222;
    cursor: pointer;
    text-align: center;
    float: left;
    margin-right: 1px;
    margin-bottom: 1px;
    text-transform: uppercase;
    font-size: .8rem;
    font-weight: 500;
  }
  .constructor-add-element:hover {
    background: #111;
  }

  .viewerresults {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
  }

  .component {
    cursor: pointer;
  }

  button {
    border: 0;
    margin: 1rem;
    padding: 0 1rem;
    background: #2980B9;
    color: #fff;
    cursor: pointer;
    line-height: 1;
    border-radius: 2px;
    display: block;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 2.618rem;
    height: 2.618rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, inset rgba(255, 255, 255, 0.05) 0 1px 0;
    font-size: 0.8rem;
  }
  button.-light {
    background: #BDC3C7;
    color: #2C3E50;
  }
  button.-danger {
    background: #a00;
  }
  button.-danger:hover {
    background: #c00;
  }
  .input {
    line-height: 1;
    padding: 0.618rem 1.2rem;
    border: 0;
    display: block;
    border-radius: 2px;
    width: 100%;
    background: #222;
    color: #777;
    border-radius: 2rem;
    font-weight: 400;
  }
  .input[type='text'] {
    box-shadow: inset rgba(0, 0, 0, 0.1) 0 1px 0, rgba(255, 255, 255, 0.05) 0 1px 0;
  }
  .input:focus {
    outline: none;
    color: #000;
    border-color: #fff;
    background: #fff;
    box-shadow: none;
  }
  .input[type='radio'] {
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
  .inline-block {
    display: inline-block;
    vertical-align: middle;
  }

  .flip-list-move {
    transition: transform 0.3s;
  }
</style>
