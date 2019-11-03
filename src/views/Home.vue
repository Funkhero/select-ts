<template>
  <div class="home">
    <v-select
      v-model="currentItem"
      :options="items"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import VSelect from '@/components/VSelect.vue';

interface Option {
  title: string,
  value: number | string,
}

@Component({
  components: {
    vSelect: VSelect,
  },
})
export default class Home extends Vue {
  currentItem: number = 1;

  items: Option[] = [
    {
      title: 'Заголовок1',
      value: 1,
    },
    {
      title: 'Заголовок2',
      value: 2,
    },
    {
      title: 'Заголовок3',
      value: 3,
    }
  ];
}
</script>
