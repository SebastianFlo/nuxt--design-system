<template>
  <div
    v-editable="story.content"
    class="[ example-page ]">
    <SfHeading :title="story.content.headline">
      <div
        v-if="hasRichText(story.content.intro)" slot="description"
        class="[ sf-heading__description ]"
        v-html="renderRichText($storyapi, story.content.intro)" />
    </SfHeading>
    <component
      :is="item.component"
      v-for="item in story.content.body" :key="item._uid"
      :blok="item" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfHeading } from '@storefront-ui/vue';
import { Story } from 'storyblok-js-client';
import { hasRichText, renderRichText } from '../package/base/helpers/storyblock-richtext.helper';
import Example from './Example.vue';

export default defineComponent({
  components: {
    Example,
    SfHeading,
  },
  props: {
    story: {
      type: Object as PropType<Story>,
      required: true,
    },
  },
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>

<style lang="scss">
.example-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-grow: 1;

  >.sf-heading {
    width: 100%;
    padding: var(--spacer-base) var(--spacer-sm);
    background-color: var(--c-light);
  }
}
</style>
