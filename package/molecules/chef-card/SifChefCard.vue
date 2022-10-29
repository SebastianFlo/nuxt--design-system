<template>
  <div
    class="sif-chef-card" :class="{
      'is-open': isOpen
    }">
    <img
      v-if="image && image.filename" :src="getImageSrc(image, { width: 150, ratio: 1 })"
      :alt="image.description || image.alt" width="90"
      height="90" />

    <div class="sif-chef-card__content">
      <h1>{{ title }}</h1>
      <p>{{ name }}</p>

      <div
        v-if="$slots.hasOwnProperty('default')"
        class="sif-chef-card__info">
        <slot />
      </div>

      <SfButton
        class="sf-button--pure"
        @click="isOpen = !isOpen">
        {{ !isOpen ? readMoreLabel : readLessLabel }}
      </SfButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { SfButton } from '@storefront-ui/vue';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfButton,
  },
  props: {
    image: {
      type: Object as PropType<{
        filename: string,
        description: string,
      }>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    readMoreLabel: {
      type: String,
      default: 'Read more',
    },
    readLessLabel: {
      type: String,
      default: 'Read less',
    },
  },
  setup() {
    const { getImageSrc } = useImageResizer();
    const isOpen = ref(false);

    return {
      getImageSrc,
      isOpen,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers.scss';

.sif-ds {
  .sif-chef-card {
    --chef-card-max-info-height: 3em * var(--lh--base);

    width: 100%;

    display: flex;
    align-items: flex-start;

    padding: var(--spacer-sm);

    background-color: var(--theme-background, var(--c-light-green));
    color: var(--theme-color, var(--c-text));

    font-size: var(--font-size--body-sm);

    &.is-open {
      --chef-card-max-info-height: auto;
    }

    >img {
      flex: 0 0 max(4rem, 16%);

      margin-right: var(--spacer-base);
      border-radius: 50%;
      overflow: hidden;
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    h1 {
      font-size: var(--font-size--body-sm);
      font-style: italic;
      text-transform: uppercase;
      font-weight: var(--font-weight--bold);
      line-height: var(--lh--tight);
    }

    button {
      display: inline-block;
      text-decoration: underline;
      font-weight: var(--font-weight--normal);
      font-size: inherit;
      margin-right: auto;
    }

    &__info {
      grid-column: 2/3;

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      margin-top: var(--spacer-xs);

      overflow: hidden;
    }

    &:not(.is-open) .sif-chef-card__info {
      max-height: calc(3em * var(--lh--base));
    }
  }
}
</style>
