<template>
  <section class="sif-accordion">
    <SifAccordionItem
      v-for="(item, index) in blok.items" :key="index"
      v-editable="item" :open="openIndex === index"
      :header="item.header" @open="() => openIndex = index">
      <div v-html="renderRichText($storyapi, item.content, { unwrap: true })" />
    </SifAccordionItem>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { Richtext } from 'storyblok-js-client';
import { renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifAccordionItem from './SifAccordionItem.vue';

// Cms model
interface AccordionItem {
  header: string;
  content: Richtext;
}

export default defineComponent({
  components: {
    SifAccordionItem,
  },
  props: {
    blok: {
      type: Object as PropType<{
        openFirst: boolean,
        items: AccordionItem[]
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const openIndex = ref<null | number>(blok.openFirst ? 0 : null);

    return {
      // methods
      renderRichText,

      // data
      openIndex,
    };
  },
});
</script>

<style lang="scss">
.sif-accordion {
  width: 100%;
}
</style>
