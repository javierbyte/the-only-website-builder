<template>
  <div class="main">

    <div class="sidebar" :class="{'-open': editorStatus.editingActive}">
      <div class="sidebar-content">
        <div class="sidebar-constructor">
          <div class="sidebar-header">
            Build your website!
          </div>
          <transition-group class="constructor-container flex-1" name="flip-list" tag="div"  v-sortable="{onUpdate: onUpdateOrder}">
          <!--
          <div class="constructor-container flex-1" v-sortable="{onUpdate: onUpdateOrder}">
          -->
            <div v-for="web in orderedElements" :key="web._id">
              <div class="constructor-element">
                <div @click="onEditElement(web._id)" class="constructor-element-content touchable">
                  <div class="constructor-element-content-icon">
                    <div :class="kIcons[web.type]"/>
                    <div class="constructor-element-content-icon-type">
                      {{web.type}}
                    </div>
                  </div>
                  <div class="constructor-element-content-title">
                    {{web.data.title}}
                  </div>
                </div>
              </div>
              <div class="constructor-element-delete" @click="onDeleteElement(web._id)">
                <div class="icon ti-close"></div>
              </div>
            </div>
          </transition-group><!-- ./constructor-container -->

          <div class="constructor-add">
            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-layout-media-center"></div>
              <div class="constructor-add-element-title">
                Header
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('FOOTER')">
              <div class="constructor-add-element-icon ti-layout-media-overlay-alt"></div>
              <div class="constructor-add-element-title">
                Footer
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('FEATURE')">
              <div class="constructor-add-element-icon ti-layout-media-left"></div>
              <div class="constructor-add-element-title">
                Feature
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-layout-list-thumb-alt"></div>
              <div class="constructor-add-element-title">
                Gallery
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-layout-slider"></div>
              <div class="constructor-add-element-title">
                Slider
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-layout-accordion-list"></div>
              <div class="constructor-add-element-title">
                Timeline
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-map-alt"></div>
              <div class="constructor-add-element-title">
                Map
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-email"></div>
              <div class="constructor-add-element-title">
                Contact
              </div>
            </div>

            <div class="constructor-add-element" @click="onAddElement('HEADER')">
              <div class="constructor-add-element-icon ti-menu"></div>
              <div class="constructor-add-element-title">
                Menu
              </div>
            </div>
          </div><!-- /constructor-add -->

          <div class="sidebar-export">
            <button @click="onDownloadWebsite">
              Download your website!
            </button>

            <a href="#" class="sidebar-export-link" @click="onShareWebsite">
              Share real-time editor URL
              <div>Highly experimental!</div>
            </a>
          </div>

          <div class="sidebar-footer">
            Made by <a href="http://javier.xyz/" target="_blank">javierbyte</a>.
          </div>
        </div><!-- /sidebar-constructor -->

        <div class="sidebar-editor" v-if="orderedElements.length && activeEditingElement">
          <div class="sidebar-header" :key="activeEditingElement._id">
            Editing {{activeEditingElement.type}}

            <div class="sidebar-header-back" @click="onCancelEditing">
              <div class="icon ti-angle-left"></div>
            </div>
          </div>

          <div class="sidebar-editor-content">
            <div
              :is="'editor-' + activeEditingElement.type.toLowerCase()"
              :element="activeEditingElement">
            </div>

            <div class="sidebar-editor-footer flex flex-space-between">
              <button @click="onCancelEditing" class="inline-block">
                <div class="icon ti-angle-left"></div>
                Go back
              </button>
              <button @click="onDeleteElement(activeEditingElement._id)" class="-danger inline-block">
                <div class="icon ti-close"></div>
                Delete
              </button>
            </div><!-- /editor-foote -->
          </div><!-- /sidebar-editor-content -->
        </div><!-- /sidebar-editor -->
      </div><!-- /sidebar-content -->
    </div><!-- /sidebar -->

    <transition-group class="viewerresults" name="flip-list" tag="div">
      <div
        class="component"
        v-for="web in orderedElements"
        :key="web._id"
        :is="'viewer-' + web.type.toLowerCase()"
        :data="web.data">
      </div>
    </transition-group>
  </div>
</template>

<script>
const _ = require('lodash')
const uuidV1 = require('uuid/v1')
var simplediff = require('../simplediff.js')()

const ROOM = window.location.search.split('?room=')[1] || uuidV1()

history.pushState({}, null, `?room=${ROOM}`);

var socket = {}
if (window.location.hostname !== 'localhost') {
  console.info('Connecting javierbyte socket')
  socket = io.connect('https://the-only-website-server-awhunhujrp.now.sh')
} else {
  console.info('Connecting localhost socket')
  socket = io.connect('https://the-only-website-server-awhunhujrp.now.sh')
}

var kIcons = {
  HEADER: 'ti-layout-media-center',
  FOOTER: 'ti-layout-media-overlay-alt',
  FEATURE: 'ti-layout-media-left'
}

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
          minHeight: '0',
          backgroundColor: '#1B1B26',
          color: '#FFFFFF',
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
        title: '©2016 Footer Text',
        style: {
          backgroundColor: '#EEEEEE',
          color: '#666666',
          textAlign: 'left',
          fontSize: '1rem'
        }
      }
    },
    FEATURE: {
      type: 'FEATURE',
      meta: {
        active: true
      },
      data: {
        features: [{
          icon: 'ti-close',
          title: 'Feature name',
          description: 'Feature description'
        }],
        style: {
          minHeight: '0',
          backgroundColor: '#e0e1e2',
          color: '#456',
        }
      }
    }
  }

  return _.assign({}, _.cloneDeep(kTypes[type]), {
    _id: uuidV1()
  })
}

function keepDataInSync(room, pushAdapter, pullAdapter) {
  var state = {}

  return {
    pushDelta(newState) {
      var delta = simplediff.diff(state, newState)
      state = _.cloneDeep(newState)

      if (delta) {
        pushAdapter({
          delta: delta,
          blocks: newState.blocks,
          order: newState.order
        })
      } else {
        console.info('NO DELTA - PUSH')
      }
    },
    pullDelta(ctx, delta) {
      try {
        state = simplediff.patch(state, delta)

        if (_.isEqual(ctx.webData, state)) {
          console.warn('REJECT PATCHING - NO CHANGE', JSON.stringify(delta))
        } else {
          // console.warn('PATCHING', JSON.stringify(delta),_.isEqual(ctx.webData, state),simplediff.diff(ctx.webData, state))
          // console.warn(JSON.stringify(ctx.webData))
          // console.warn(JSON.stringify(state))
          pullAdapter(ctx, _.cloneDeep(state))
        }
      } catch(e) {
        console.error('Patch failed')
      }
    },

    setState(ctx, newState) {
      state = _.cloneDeep(newState)
      pullAdapter(ctx, _.cloneDeep(state))
    }
  }
}

const stateAdapter = keepDataInSync(ROOM, (push, push2) => {
  // pushAdapter
  console.warn('PUSH', JSON.stringify(push.delta))
  socket.emit('DELTA', _.assign({}, {room: ROOM}, push))
}, (ctx, pull) => {
  // pullAdapter
  // console.warn('\n\nPULL - APPLY', JSON.stringify(pull), JSON.stringify(ctx.webData))
  ctx.$set(ctx, 'webData', pull)
})

const throttledPushDelta = _.throttle(stateAdapter.pushDelta, 256, {
  leading: false,
  trailing: true
})

const app = {
  name: 'app',
  created() {
    socket.on('UPDATE', newWebData => {
      console.warn('UPDATE FROM SOCKET', newWebData.delta)
      stateAdapter.pullDelta(this, newWebData.delta)
    })

    socket.on('INITIAL', newWebData => {
      console.info('INITIAL FROM SOCKET', newWebData)
      stateAdapter.setState(this, newWebData)
    })

    socket.emit('JOINROOM', ROOM)
  },
  watch: {
    webData: {
      handler: throttledPushDelta,
      deep: true
    }
  },
  methods: {
    onUpdateOrder(evt) {
      this.webData.order.splice(evt.newIndex, 0, this.webData.order.splice(evt.oldIndex, 1)[0])
    },
    onEditElement(_id) {
      console.log('Enter edit mode', _id)
      this.editorStatus.editingActive = true
      this.editorStatus.editingElement = _id
    },
    onDeleteElement(_id) {
      console.info('DELETE', _id)
      this.editorStatus.editingElement = null
      this.editorStatus.editingActive = false

      this.$set(this, 'webData', {
        blocks: _.omitBy(this.webData.blocks, block => {
          return block._id === _id
        }),
        order: _.without(this.webData.order, _id)
      })
    },
    onCancelEditing() {
      console.info('Leave edit mode')
      this.editorStatus.editingActive = false
    },
    onAddElement(type) {
      console.info('ADD', type)
      var newElement = getDefault(type)

      this.$set(this, 'webData', {
        blocks: _.assign({}, this.webData.blocks, {
          [newElement._id]: newElement
        }),
        order: this.webData.order.concat([newElement._id])
      })
    },
    onDownloadWebsite() {
      console.info('DOWNLOAD!')
    },
    onShareWebsite() {
      console.info('SHARE!')
    },
  },
  computed: {
    activeEditingElement() {
      return _.find(this.webData.blocks, {
        _id: this.editorStatus.editingElement
      })
    },
    orderedElements() {
      return _.map(this.webData.order, _id => {
        return this.webData.blocks[_id]
      })
    }
  },
  components: {
    'viewer-header': require('./components/header/ComponentHeader.vue'),
    'editor-header': require('./components/header/EditorHeader.vue'),

    'viewer-footer': require('./components/footer/ComponentFooter.vue'),
    'editor-footer': require('./components/footer/EditorFooter.vue'),

    'viewer-feature': require('./components/feature/ComponentFeature.vue'),
    'editor-feature': require('./components/feature/EditorFeature.vue'),
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      editorStatus: {
        editingActive: false,
        editingElement: 0
      },
      webData: {
        order: [],
        blocks: {}
      },
      kIcons: kIcons
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

  html, body, input, textarea, button {
    font-family: -apple-system, BlinkMacSystemFont, Segoe IO, Roboto, sans-serif;
    font-weight: 300;
    font-size: 15px;
    line-height: 1.618;
    text-rendering: optimizeLegibility;
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
    background: #292933;
    overflow-x: hidden;
    color: #9e9e9e;
  }
  .sidebar-content {
    transition: transform 0.3s;
  }
  .sidebar-export {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .sidebar-export-link {
    margin: 1rem;
    font-size: 0.8rem;
    text-align: center;
  }
  .sidebar-footer {
    padding: 1rem;
    text-align: center;
  }

  .sidebar a {
    color: #bbbbbd;
    text-decoration: none;
  }
  .sidebar a:hover {
    color: #eee;
  }
  .sidebar a:active {
    color: #fff;
    top: 1px;
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
    height: 100vh;
    overflow: hidden;

    display: flex;
    flex-direction: column;
  }
  .sidebar-editor-content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sidebar-header {
    height: 2.618rem;
    line-height: 2.618rem;
    text-align: center;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.8rem;
    background: #363642; /* sidebar-header-color */
    color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, rgba(0, 0, 0, 0.1) 0 1px 3px;
    z-index: 1;
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
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }
  .sidebar-header-back:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.07);
  }
  .sidebar-header-back:active {
    top: 1px;
  }
  .sidebar-editor-footer {
    margin-top: 1rem;
    padding: 2rem 1rem 1rem;
  }

  .editor {}
  .editor-block {
    padding: 1rem;
    border-top: 1px solid #363642;
    border-bottom: 1px solid #21212a;
  }
  .editor-block:first-child {
    border-top: none;
  }
  .editor-block:last-child {
    border-bottom: none;
  }
  .editor-title {
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.85rem;
    padding-bottom: 0.309rem;
  }
  .editor-subtitle {
    color: #cacada;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.75rem;
    margin-top: 1rem;
  }
  .editor-footer {
    padding: 1rem;
  }
  .editor-card {
    margin-bottom: 1rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, rgba(0, 0, 0, 0.1) 0 2px 6px;
  }
  .editor-card-header {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.618rem 1rem;
    line-height: 1rem;
    border-radius: 5px 5px 0 0;
    font-weight: 700;
    font-size: 0.9rem;
    color: #ddd;
  }
  .editor-card-body {
    background: rgba(255, 255, 255, 0.03);
    padding: 1rem;
    border-radius: 0 0 5px 5px;
  }
  .editor-card:last-of-type {
    margin-bottom: 0;
  }
  .editor-card-subtitle {
    line-height: 1;
    font-size: 0.8rem;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  .editor-icon-select {
    border-radius: 3px;
    height: 4rem;
    line-height: 4rem;
    width: 5rem;
    font-size: 1.5rem;
    text-align: center;
    padding-right: 1rem;
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .editor-icon-select::after {
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    display: block;
    top: 50%;
    right: 0.618rem;
    margin-top: -2px;
    border: 5px solid transparent;
    border-top: 5px solid rgba(255, 255, 255, 0.333);
  }
  .editor-icon-select .icon::before {
    line-height: 3.7rem;
    font-size: 2rem;
    display: block;
  }

  .constructor-container {
    margin-top: 0.5rem;
  }
  .constructor-element {
    padding: 0.5rem 1rem;
  }
  .constructor-element-delete {
    position: absolute;
    top: 0rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 1.5rem;
    background: #666;
    text-align: center;
    color: #ddd;
    display: block;
    font-size: 0.75rem;
    cursor: pointer;
    font-weight: 600;
  }
  .icon {
    display: inline-block;
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
  .constructor-element-delete:active {
    background: #f00;
    top: 1px;
  }
  .constructor-element-content {
    height: 3rem; /* var: constructor-element-content-height */
    background: #e0e1e2;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: justify;
    color: #333;
    display: flex;
  }
  .constructor-element-content-icon {
    height: 3rem; /* var: constructor-element-content-height */
    display: block;
    background: rgba(0, 0, 0, 0.1);
    width: 4rem;
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .constructor-element-content-icon-type {
    font-size: 0.618rem;
    font-weight: 400;
    margin-top: 0.309rem;
  }
  .constructor-element-content-title {
    line-height: 3rem; /* var: constructor-element-content-height */
    padding-right: 1rem;
    overflow: hidden;
    flex: 1;
    padding-left: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .constructor-element-content:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 0, rgba(0, 0, 0, 0.2) 0 2px 8px;
    background: #fff;
    color: #000;
  }
  .constructor-element-content:active {
    top: 1px;
  }

  .constructor-add {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
  }
  .constructor-add-element {
    margin-right: 1px;
    margin-bottom: 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 0 1rem;
    height: 4rem;
    background: #1b1b26;
    cursor: pointer;
    text-align: center;
    float: left;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 2px;
  }
  .constructor-add-element-title {
    line-height: 1;
    padding-bottom: 0.5rem;
  }
  .constructor-add-element:hover {
    background: #111119;
    z-index: 1;
  }
  .constructor-add-element:hover > div {
    background: linear-gradient(to bottom right, #5f86e4, #b857ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .constructor-add-element:active {
    background: #000;
    color: #fff;
    top: 1px;
  }
  .constructor-add-element-icon {
    display: block;
    height: 2rem;
    width: 2rem;
    line-height: 2rem;
    font-size: 17px;
  }

  .viewerresults {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
  }

  button {
    border: 0;
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
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 0, inset rgba(255, 255, 255, 0.22) 0 1px 0;
  }
  button.-danger:hover {
    background: #c00;
  }
  button .icon {
    margin-right: 0.25rem;
  }
  .input {
    line-height: 1;
    padding: 0.618rem 1.2rem;
    border: 0;
    display: block;
    border-radius: 2px;
    width: 100%;
    background: #1b1b26;
    color: #777;
    border-radius: 2rem;
    font-weight: 400;
  }
  .input[type='text'] {
    box-shadow: inset rgba(0, 0, 0, 0.1) 0 1px 0, rgba(255, 255, 255, 0.05) 0 1px 0;
  }
  .input[type='range'] {
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
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
  .flex {
    display: flex;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .flex-justify-center {
    justify-content: center;
  }
  .flex-space-between {
    justify-content: space-between;
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

  .touchable {
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .text-gradient {
    background: linear-gradient(to bottom right, #5f86e4, #b857ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media screen and (max-width: 768px) {
    .sidebar {
      display: none;
    }

    html, body, input, textarea, button {
      font-size: 13px;
    }
  }

  @media screen and (max-width: 640px) {
    .sidebar {
      display: none;
    }

    html, body, input, textarea, button {
      font-size: 12px;
    }
  }
</style>
