<template>
  <section
    class="sif-product-details"
    :style="background ? `background: #${background}` : ''">
    <div class="sif-product-details__media">
      <picture v-if="image">
        <source
          :srcset="getImageSrcSet(image, {
            breakpoints: [
              { breakpoint: 0, width: 320 },
              { breakpoint: 1440, width: isProduct ? 640 : 1024 }
            ],
            ratio: image.ratio || (15 / 8),
            format: 'webp'
          })" sizes="100vw"
          type="image/webp" width="375" />
        <img
          :src="getImageSrc(image, { width: 640 })" :alt="image.description || image.alt"
          width="375"
          :style="isProduct ? '' : 'width: 100%'" />
      </picture>

      <div
        v-if="$slots.hasOwnProperty('info')"
        class="sif-product-details__info">
        <slot name="info" />
      </div>
    </div>
    <div class="sif-product-details__body">

      <h1 class="sif-product-details__title">
        {{ title }}
      </h1>

      <p class="sif-product-details__sub-title">
        {{ subTitle }}
      </p>

      <div
        v-if="tags && tags.length"
        class="sif-product-details__tags">
        <SifTagPill
          v-for="tag of tags"
          :key="tag.title" :icon="tag.image"
          :name="tag.title" />
      </div>

      <section
        v-if="$slots.hasOwnProperty('box')"
        class="sif-product-details__box">
        <slot name="box" />
      </section>

      <slot />
    </div>
    <aside
      v-if="$slots.hasOwnProperty('supportive-content')"
      class="sif-product-details__supportive-content">
      <slot name="supportive-content" />
    </aside>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { getTagIcon } from '../../atoms/tag/-tags.helper';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  props: {
    image: {
      type: Object as PropType<{ filename: string, description: string, ratio?: number }>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: null,
    },
    isProduct: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup() {
    const { getImageSrcSet, getImageSrc } = useImageResizer();

    const tab = ref<string | null>(null);

    return {
      tab,

      getImageSrcSet,
      getTagIcon,
      getImageSrc,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-product-details {
    display: flex;
    flex-direction: column;
    background: var(--c-light-lighten);

    &__media {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      align-items: flex-end;

      >* {
        grid-column: -1/1;
        grid-row: -1/1;
      }

      picture {
        display: flex;
        justify-content: center;
      }
    }

    &__info {
      justify-self: flex-start;

      display: flex;
      align-items: center;

      color: var(--c-blue);
      font-weight: var(--font-weight--normal);

      margin: var(--spacer-sm) var(--app-gutter);
      padding: .25em var(--spacer-xs) .25em var(--spacer-2xs);
      background-color: var(--c-light-lighten);
      border-radius: 5em;

      // icon
      >span {
        display: flex;
        margin-right: .666ch;
        color: var(--c-blue-darken);
      }
    }

    &__body {
      padding: var(--spacer-base) var(--app-gutter) var(--spacer-sm) var(--app-gutter);
    }

    &__title {
      margin-bottom: .15em;

      font-weight: var(--font-weight--normal);
      font-family: var(--font-family--primary);
      font-size: var(--font-size--title-base);
      line-height: var(--lh--flat);
      max-width: 20ch;
    }

    &__sub-title {
      margin-bottom: var(--spacer-lg);
      font-size: var(--font-size--body-base);
      max-width: 45ch;
    }

    &__box {
      margin-left: calc(-1 * var(--spacer-xs));
      margin-right: calc(-1 * var(--spacer-xs));

      >* {
        border-radius: 10px;
      }
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacer-xs);
      margin-bottom: var(--spacer-lg);
    }

    &__supportive-content {
      font-size: var(--font-size--body-sm);

      .sif-accordion {
        summary {
          font-family: var(--font-family--primary);
          font-size: var(--font-size--body-base);
          font-weight: var(--font-weight--normal);
        }

        ol,
        ul {
          padding-left: var(--spacer-base);
        }

        li+li,
        p+* {
          margin-top: 1em;
        }
      }

      .sif-accordion-item {
        --accordion-item-side-padding: var(--app-gutter);
      }
    }
  }
}
</style>
