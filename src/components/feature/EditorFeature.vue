<template>
  <div class="editor-component-feature">

  	<div class="editor-block">
  		<div class="editor-title">Elements</div>

			<div class="editor-card" v-for="(feature, featureIdx) in element.data.features">
				<div class="editor-card-header flex">
					<div>Feature element</div>

					<div class="flex-1" />

					<div>
						<div class="icon ti-close" @click="onDeleteFeature(featureIdx)"></div>
					</div>
				</div>

				<div class="editor-card-body">
					<div class="editor-card-subtitle">Feature image</div>

					<div class="editor-icon-select">
						<div class="icon ti-desktop"></div>
					</div>

					<br />

					<div class="editor-card-subtitle">Feature name</div>
					<input class="input" type="text" v-model="feature.title" />

					<br />

					<div class="editor-card-subtitle">Feature description</div>
					<input class="input" type="textarea" v-model="feature.description" />
				</div>
			</div>


		<br />
     <button @click="onNewFeature">
      Add another feature
    </button>

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
    name: 'editor-feature',
    props: ['element'],
    components: {
    	blockSize: require('../../ui/BlockSize.vue'),
    	colorPicker: require('../../ui/ColorPicker.vue')
    },
    methods: {
    	onNewFeature() {
    		this.element.data.features.push({
    			title: 'New feature',
    			description: 'New feature',
    			icon: 'ti-close'
    		})
    	},
    	onDeleteFeature(idx) {
    		this.element.data.features = _.filter(this.element.data.features, (feature, featureIdx) => {
    			return featureIdx !== idx;
    		})
    	}
    }
  }
</script>
