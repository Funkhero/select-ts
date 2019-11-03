<template>
  <div class="popup">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MySelect extends Vue {}
</script>

<style lang="stylus" scoped>
.popup
  min-width: 70px
  background-color: #fff
  border: 1px solid lightgray
  border-radius: 3px
  padding: 10px 0
  box-shadow: 4px 4px 10px rgba(0, 0, 0, .1)
  position: absolute
  z-index: 2
  top: 100%
</style>
