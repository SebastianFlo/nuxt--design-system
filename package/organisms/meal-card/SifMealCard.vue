<template>
  <div
    class="meal-card" :class="{
      'meal-card--narrow': isNarrow
    }">
    <picture v-if="image && image.filename">
      <source
        :srcset="getImageSrcSet(image, {
          breakpoints: [{
            breakpoint: 0, width: 460,
            breakpoint: 1440, width: 700
          }],
          ratio: isNarrow ? 280 / 170 : 347 / 190,
          format: 'webp'
        })" type="image/webp"
        sizes="(min-width: 1024px) 33vw, 100vw">
      <img
        :src="getImageSrc(image, { width: 460 })" :alt="image.description || image.alt"
        loading="lazy" width="451"
        height="338">
    </picture>
    <div
      v-if="!image.filename"
      class="meal-card__image-placeholder">
      {{ noImageLabel }}
    </div>

    <SfBadge v-if="badge">
      {{ badge }}
    </SfBadge>

    <h2>{{ title }}</h2>

    <slot name="cta" />

    <div
      v-if="$slots.hasOwnProperty('info') || tags.length"
      class="meal-card__info">
      <div
        v-if="tags.length"
        class="meal-card__tags">
        <SifTag
          v-for="tag in tags"
          :key="tag.id" :icon="tag.image"
          :name="tag.title || ''" />
      </div>
      <slot name="info" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfBadge } from '@storefront-ui/vue';
import SifTag from '../../atoms/tag/SifTag.vue';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfBadge,
    SifTag,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: Object as PropType<{ filename: string, description: string }>,
      required: true,
    },
    isNarrow: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: '',
    },
    tags: {
      type: Array as PropType<{ name: string, icon: string, description?: string }[]>,
      default: () => [],
    },
    infoLabel: {
      type: String,
      default: '',
    },
    noImageLabel: {
      type: String,
      default: 'No image',
    },
  },
  setup() {
    const { getImageSrcSet, getImageSrc } = useImageResizer();

    return {
      getImageSrcSet,
      getImageSrc,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .meal-card {

    display: grid;
    grid-template-columns: 1fr minmax(7rem, auto);
    grid-template-areas:
      "media media"
      "title  cta "
      "info   info";
    column-gap: var(--spacer-base);
    align-items: flex-start;

    text-decoration: none;
    color: var(--c-text);
    border-bottom: var(--border-base);

    cursor: pointer;

    h2 {
      margin-top: var(--spacer-2xs);
      line-height: var(--lh--tight);
      font-size: var(--font-size--body-lg);
      font-weight: var(--font-weight--normal);
      max-width: 25ch;
    }

    &.meal-card--narrow {
      h2 {
        font-size: var(--font-size--body-lg);
      }

      .sf-badge {
        margin-bottom: var(--spacer-lg);
      }
    }

    picture,
    .sf-badge,
    &__image-placeholder {
      grid-area: media;
    }

    &__image-placeholder,
    img,
    picture {
      width: 100%;
    }

    picture {
      overflow: hidden;

      img {
        transition: transform .2s ease-in-out;

        &:hover {
          transform: scale(1.07);
        }
      }
    }

    .sf-badge {
      --theme-background: var(--c-creme);
      --theme-color: var(--c-blue);

      align-self: flex-end;

      margin-bottom: var(--spacer-sm);
      margin-left: var(--spacer-sm);

      z-index: var(--z-index-content-front);
    }

    &__image-placeholder {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 347px;
      height: 190px;

      background: var(--c-light-lighten);
    }

    h2 {
      grid-area: title;
      line-height: var(--lh--tight);

      // make sure that cards align vertically across different amounts
      // of title text.
      min-height: calc(1em * 2 * var(--lh--tight));
      text-align: left;
      display: -webkit-box;
      max-width: 25ch;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .sf-button {
      grid-area: cta;
      --theme-background: var(--c-creme);
      --theme-color: var(--c-blue);
      --button-padding: 0.5rem 1.6rem;
      margin-top: var(--spacer-sm);

      min-width: 7.2rem;
    }

    &__tags {
      justify-self: flex-start;

      // this is a solution for safari not supporting flex gap yet.
      // (flex is the right choice of layout)
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1.75rem;
      grid-auto-rows: 1.75rem;

      gap: var(--spacer-2xs);
    }

    &__info {
      grid-area: info;
      align-self: center;

      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-top: var(--spacer-lg);
      padding: var(--spacer-2xs) 0;
      border-top: var(--border-base-dashed);

      font-size: var(--font-size--body-sm);
      font-weight: var(--font-weight--normal);
    }
  }
}
</style>
