<template>
  <SfHeading>
    <component
      :is="tag" slot="title"
      class="[ sf-heading__title ]" :class="[
        tag,
        blok.variant === 'secondary' && 'is-secondary',
      ]"
      v-html="renderRichText($storyapi, blok.title, { unwrap: true })" />
    <div
      v-if="hasRichText(blok.description)" slot="description"
      class="[ sf-heading__description ]"
      v-html="renderRichText($storyapi, blok.description)" />
  </SfHeading>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfHeading } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';

export default defineComponent({
  components: {
    SfHeading,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tag(): string {
      switch (this.blok.size) {
        case 'lg': return 'h1';
        case 'base': return 'h2';
        case 'sm': return 'h3';
        default: return 'h2';
      }
    },
  },
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>
