<template>
  <SifSidebar
    :visible="isOpen" :title="blok.title"
    :header-theme="blok.headerTheme" :header-close="blok.headerClose"
    :footer-theme="blok.footerTheme" @close="() => $emit('close')">

    <p
      v-if="blok.headerSubtitle"
      slot="header" class="sif-sidebar__header-subtitle">
      {{ blok.headerSubtitle }}
    </p>
    <h2
      v-if="hasRichText(blok.headerTitle)" slot="header"
      class="sif-sidebar__header-title"
      v-html="renderRichText($storyapi, blok.headerTitle, { unwrap: true })" />
    <component
      :is="getSifCmsComponentName(item.component)" v-for="item of blok.header"
      :key="item._uid" slot="header"
      v-editable="item" :blok="item" />

    <component
      :is="getSifCmsComponentName(item.component)" v-for="item of blok.content"
      :key="item._uid"
      v-editable="item" :blok="item" />

    <component
      :is="getSifCmsComponentName(item.component)" v-for="item of blok.footer"
      :key="item._uid" slot="footer"
      v-editable="item" :blok="item" />
  </SifSidebar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';
import SifSidebar from './SifSidebar.vue';

export default defineComponent({
  components: {
    SifSidebar,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      getSifCmsComponentName,
      hasRichText,
      renderRichText,
    };
  },
});
</script>
