<template>
  <ul class="list">
    <li
      v-for="(item, index) in items"
      :key="index"
      class="list__item"
    >
      <slot
        :item="item"
        :index="index"
        name="listItemContent"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) items!: any[];
}
</script>

<style lang="stylus" scoped>
.list
  list-style-type: none
  background-color #fff
  &__item
    position relative
    &:last-child
      margin-bottom 0 !important
  &_margins
    &_xs
      .list__item
        margin-bottom 4px
    &_sm
      .list__item
        margin-bottom 8px
</style>
