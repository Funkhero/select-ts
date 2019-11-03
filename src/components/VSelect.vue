<template>
  <div
    :class="selectClasses"
    class="select"
  >
    <div
      v-click-outside="closeOptions"
      :class="activatorClasses"
      class="select__activator"
      @keydown.enter="closeOptions"
      @click.prevent.stop="onActivatorClick"
      @keydown.up="moveUp"
      @keydown.down="moveDown"
    >
      <input
        v-if="!(withSearch || withManualEnter)"
        :value="textValue"
        :placeholder="placeholder"
        type="text"
        class="select__input"
      >
      <input
        v-else
        v-model="search"
        :placeholder="withSearch ? 'Select element' : '- -'"
        type="text"
        class="select__input"
      >
    </div>
    <transition name="slide-top-anim">
      <v-popup
        v-if="optionsIsVisible"
        class="select__popup"
      >
        <v-list
          v-if="filteredOptions.length"
          :items="filteredOptions"
          class="select__options"
        >
          <div
            slot="listItemContent"
            slot-scope="slotProps"
            :class="{
              active: slotProps.index === currentIndex,
              disabled: slotProps.item.disabled
            }"
            class="select__option"
            @click="onOptionClick(slotProps.item.value)"
            @keyup.enter="onOptionClick(slotProps.item.value)"
          >
            {{ slotProps.item.title }}
          </div>
        </v-list>
        <span
          v-else
          class="select__no-data"
        >
          {{ search.length ? 'notFound' : 'noData' }}
        </span>
      </v-popup>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  PropSync,
  Watch,
} from 'vue-property-decorator';

import VList from '@/components/VList.vue';
import VPopup from '@/components/VPopup.vue';

type OptionData = {
  title: string,
  value: string | number,
  disabled?: boolean,
  index?: number
}

@Component({
  components: {
    VList,
    VPopup,
  },
})
export default class VSelect extends Vue {
  optionsIsVisible: boolean = false;

  search: string = '';

  @PropSync('value', { type: [String, Number], default: 0 })
  currentValue?: string | number;

  @Prop({ type: Boolean, default: false })
  required?: boolean;

  @Prop({ type: Boolean, default: false })
  disabled?: boolean;

  @Prop({ type: Boolean, default: false })
  withSearch?: boolean;

  @Prop({ type: Boolean, default: false })
  withManualEnter?: boolean;

  @Prop({ type: String, default: '' })
  placeholder?: string;

  @Prop({ type: Array, default: () => [] })
  options!: OptionData[];

  get selectClasses() {
    let result = '';
    result += this.required ? 'select_required' : '';
    result += this.disabled ? 'select_disabled' : '';

    return result;
  }

  get activatorClasses() {
    let result = '';

    result += this.optionsIsVisible ? 'select__activator_focus' : '';

    return result;
  }

  get currentIndex() {
    let currentIndex: number = -1;
    if (this.currentValue) {
      currentIndex = this.options.findIndex(option => option.value === this.currentValue);
    }
    return currentIndex;
  }

  get textValue() {
    return this.currentIndex >= 0 ? this.options[this.currentIndex].title : '';
  }

  get preparedOptions() {
    return this.options.map((option, index: number) => ({
      ...option,
      index,
    }));
  }

  get filteredOptions() {
    const enabledOptions: OptionData[] = this.preparedOptions.filter(option => !option.disabled);

    if (this.withSearch && this.search.length) {
      return enabledOptions.filter(option => option.title.toLowerCase()
        .includes(this.search.toLowerCase()));
    }

    return enabledOptions;
  }

  @Watch('currentValue', { immediate: true })
    onValueChanged(val: string | number) {
      if (val && (this.withSearch || this.withManualEnter)) {
        this.search = this.options[this.currentIndex].title;
      }
    }

  moveUp() {
    if (this.currentIndex > 0) {
      const index: number = this.currentIndex - 1;
      this.$emit('input', this.filteredOptions[index].value);
    }
  }

  moveDown() {
    if (this.currentIndex < this.filteredOptions.length - 1) {
      const index: number = this.currentIndex + 1;
      this.$emit('input', this.filteredOptions[index].value);
    }
  }

  closeOptions() {
    if (this.withManualEnter && this.optionsIsVisible) {
      const emittedObj = {
        title: this.search,
      };
      this.$emit('input', emittedObj);
    }
    this.optionsIsVisible = false;
  };

  onOptionClick(clickedValue: string | number) {
    this.$emit('input', clickedValue);
    this.optionsIsVisible = false;
  };

  onActivatorClick() {
    if (this.withSearch || this.withManualEnter) {
      this.optionsIsVisible = true;
    } else {
      this.optionsIsVisible = !this.optionsIsVisible;
    }
  }
}
</script>

<style lang="stylus" scoped>
.select
  position relative
  &__activator
    height 32px
    border 1px solid gray
    border-radius 2px
    padding 0 10px
    display flex
    align-items center
    cursor pointer
    transition all .3s ease
    &:hover
      border-color lightsalmon
    &_focus
      border-color darkgray
      &:hover
        border-color darkgray
  &__text
    padding-right 15px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    font-weight 400
  &__popup
    margin-top 0
    width 100%
    max-height 200px
    overflow auto
  &__option
    padding 8px 15px
    cursor pointer
    transition all .3s ease
    align-items center
    position relative
    &.active
      color lightsalmon
    &.disabled
      pointer-events none
      color lightgrey
    &:hover
      background-color lightgrey
    &:focus
      background-color gray
  &__no-data
    display flex
    justify-content center
    align-items center
    height 36px
    padding 0 20px
    cursor pointer
  &__input
    border none
    padding 0
    width calc(100% - 20px)
    overflow-x hidden
    text-overflow ellipsis
    height: 100%;
    &:focus
      outline none
  &_disabled
    background lightgrey
    pointer-events none
    .select__text
      color lightgrey

.slide-top-anim
  &-enter-active,
  &-leave-active
    transition .3s ease
  &-enter,
  &-leave-to
    transform translateY(10px)
    opacity 0
  &-leave,
  &-enter-to
    transform translateY(0)
    opacity 1
</style>
