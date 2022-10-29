<template>
  <div
    class="info-card"
    :class="themeClasses"
  >

    <h3
      v-if="hasRichText(blok.title)"
      class="info-card__title"
      v-html="renderRichText($storyapi, blok.title, { unwrap: true })"
    />
    <picture
      v-if="blok.image && blok.image.filename"
      class="info-card__image"
    >
      <source
        :srcset="getImageSrcSet(blok.image, {
          breakpoints: [{
            breakpoint: 0, width: 280,
            breakpoint: 1440, width: 280
          }],
          ratio: 280 / 400,
          format: 'webp'
        })"
        type="image/webp"
        sizes="(min-width: 1024px) 33vw, 100vw"
      >
      <img
        :src="getImageSrc(blok.image, { width: 280 })"
        :alt="blok.image.description || blok.image.alt"
        loading="lazy"
        width="280"
        height="400"
      >
    </picture>

    <SifCmsButton
      v-if="blok.cta && blok.cta[0]"
      slot="primary-cta"
      v-editable="blok.cta[0]"
      class="info-card__cta"
      :blok="blok.cta[0]"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

import SifCmsButton from '../../atoms/button/SifCmsButton.vue';

export default defineComponent({
  components: {
    SifCmsButton,
  },
  props: {
    blok: {
      type: Object as PropType<{
        image: any,
        title: any,
        cta: any,
        theme?: string,
      }>,
      required: true,
    },
  },
  setup(props) {
    const { getImageSrc, getImageSrcSet } = useImageResizer();
    const themeClasses = computed(() => props.blok.theme ? `theme--${props.blok.theme}` : '');

    return {
      themeClasses,

      getImageSrc,
      getImageSrcSet,
      renderRichText,
      hasRichText,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .info-card {
    @import '@storefront-ui/shared/styles/_helpers.scss';

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    position: relative;

    justify-content: center;
    align-items: center;
    align-content: center;

    color: var(--theme-color, var(--c-text));
    background-color: var(--theme-background, var(--c-light-green));

    @include for-desktop {
      width: 100%;
      max-width: 33vw;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;

      img {
        width: 100%;
      }
    }

    &__title {
      max-width: 45ch;
      text-align: center;
      font-weight: 300;
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: var(--font-size--title-base);
    }

    &__cta.sf-button {
      --button-background: var(--c-neon);
      --button-color: var(--c-dark-green);
      --button-border-color: var(--c-neon);

      --button-hover-background: var(--c-neon);
      --button-hover-color: var(--c-dark);

      max-width: 45ch;
      text-align: center;
      font-weight: var(--font-weight--normal);
      position: absolute;
      font-style: normal;
      top: 90%;
      left: 50%;
      transform: translate(-50%, -50%);

    }
  }
}
</style>
