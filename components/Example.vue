<template>
  <section
    v-editable="blok"
    class="[ example ]" :class="classes">
    <SfHeading
      :title="blok.headline"
      :level="4">
      <div
        v-if="hasRichText(blok.description)"
        slot="description"
        class="[ sf-heading__description ]"
        v-html="renderRichText($storyapi, blok.description)" />
    </SfHeading>

    <SfButton
      v-if="blok.toggleButtonText"
      class="color-info"
      @click="toggleContent">
      {{ blok.toggleButtonText }}
    </SfButton>

    <section
      :class="{
        'example__grid': true,
        'use-bg': !blok.toggleButtonText
      }"
      :style="{
        'gap': `var(${blok.gap})`,
      }">
      <component
        :is="getSifCmsComponentName(item.component)"
        v-for="(item, index) in content"
        :key="item._uid"
        v-editable="item"
        v-bind="getComponentProps(index)"
        :class="getComponentClass(index)"
        :blok="item"
        :is-open="isOpen"
        @close="isOpen = false" />
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { SfButton, SfHeading, SfDivider } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../package/base/helpers/storyblock-richtext.helper';
import { getSifCmsComponentName } from '../package/base/helpers/storyblok-component.helpers';
import { useStory } from '../package/base/hooks/use-story';

export default defineComponent({
  components: {
    SfButton,
    SfHeading,
    SfDivider,
  },
  props: {
    blok: {
      type: Object,
      default: null,
    },
  },
  setup({ blok }) {
    const isOpen = ref(false);

    const story = blok.story ?
      useStory({ uuid: blok.story }) :
      ref(null);

    return { isOpen, story };
  },
  computed: {
    // Adds classes based on CMS variant
    content(): any {
      if (this.story?.content) {
        return [this.story.content];
      }

      return this.blok.content;
    },
    classes(): string {
      return [
        this.blok.variant ? `example--${this.blok.variant}` : null,
        this.blok.theme ? `example--${this.blok.theme}` : null,
      ]
        .filter(Boolean)
        .join(' ');
    },
    propsData(): any {
      try {
        return this.blok.props ? JSON.parse(this.blok.props) : {};
      } catch (err) {
        return {};
      }
    },
  },
  methods: {
    getSifCmsComponentName,
    hasRichText,
    renderRichText,
    getComponentProps(index: number) {
      return Array.isArray(this.propsData) ?
        this.propsData[index] :
        this.propsData;
    },
    getComponentClass(index: number) {
      return this.getComponentProps(index)?.class ?? '';
    },
    toggleContent() {
      this.isOpen = !this.isOpen;
    },
  },
});
</script>


<style lang="scss">
.example {
  --example-gutter: var(--spacer-sm);
  --example-content-padding: var(--spacer-base);

  display: flex;
  flex-direction: column;

  width: 100%;
  padding: var(--example-gutter);

  &--full-width {
    --example-content-padding: 0;
    --example-gutter: var(--spacer-sm) 0 0 0;

    >div {
      width: 100%;
    }
  }

  width: 100%;
  padding: 0;

  >.sf-heading {
    --heading-text-transform: none;
    padding: 12px;
    min-width: 200px;
    background: var(--c-light-darken);

    >.sf-heading__title {
      font-weight: 800;
      border-bottom: 1px solid white;
      padding-bottom: 5px;
      width: fit-content;
    }
  }

  &__grid {
    display: flex;
    flex-direction: column;
    padding: var(--example-content-padding);
    width: 100%;

    &.use-bg {
      background: repeating-linear-gradient(45deg,
          var(--c-light),
          var(--c-light) 1px,
          transparent 2px,
          transparent 10px);
    }

    >* {
      display: flex;
      flex-basis: 100%;
    }
  }

  > {

    p,
    span {
      max-width: 60ch;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
