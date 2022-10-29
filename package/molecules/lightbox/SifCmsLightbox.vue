<template>
  <SifLightbox
    :is-open="isOpen"
    :index="index" @navigate="($index) => index = $index"
    @close="close">
    <img
      v-for="item of blok.items"
      :key="item._uid" :src="item.filename"
      :alt="item.description" />
  </SifLightbox>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import SifLightbox from './SifLightbox.vue';

export default defineComponent({
  components: {
    SifLightbox,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    blok: {
      type: Object as PropType<{
        items: any[],
        fakeDelay?: string,
        index?: string,
      }>,
      required: true,
    },
  },
  setup({ blok }, { emit }) {
    const index = ref(blok.index != null ? parseInt(blok.index, 0) : 0);

    const close = () => emit('close');

    return {
      index,
      close,
    };
  },
});
</script>
