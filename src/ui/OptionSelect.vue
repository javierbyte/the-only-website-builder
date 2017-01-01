<script>
  export default {
    name: 'editor-ui-optionSelect',
    props: ['value', 'options'],
    methods: {
      onChange(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
</script>

<template>
  <div class="ui-options-container">
    <div
      v-for="(option, optionKey) in options"
      class="ui-options-element touchable"
      :class="{'-active': optionKey === value}"
      @click="onChange(optionKey)">
      {{option}}
    </div>
  </div>
</template>

<style>
  .ui-options-container {
    display: flex;
    border: 1px solid #cacada;
    border-radius: 3px;
  }

  .ui-options-element {
    flex: 1;
    text-align: center;
    padding: 0.5rem;
    line-height: 1;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  .ui-options-element:not(:last-child) {
    border-right: 1px solid #cacada;
  }
  .ui-options-element.-active {
    font-weight: 400;
    background: #cacada;
    color: #222;
  }
</style>
