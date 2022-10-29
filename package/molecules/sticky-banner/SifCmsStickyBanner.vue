<template>
  <transition name="sf-fade">
    <SifStickyBanner
      v-if="isOpen"
      :link="blok.link" :link-text="blok.linkText">
      <div
        v-if="hasRichText(blok.text)"
        v-html="renderRichText($storyapi, blok.text)" />
    </SifStickyBanner>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifStickyBanner from './SifStickyBanner.vue';

export default defineComponent({
  components: {
    SifStickyBanner,
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
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>
