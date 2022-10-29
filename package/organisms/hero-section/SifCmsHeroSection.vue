<template>
  <section
    class="sif-hero-section"
    :class="classes">
    <picture v-if="blok.media && blok.media.filename">
      <source
        :srcset="getImageSrcSet(blok.media, {
          breakpoints: [{ breakpoint: 0, width: 460 }],
          ratio: isFullImage ? (4/1) : (375 / 310)
        })" media="(max-width: 375px) and (max-height: 667px)"
        sizes="100vw">
      <source
        :srcset="getImageSrcSet(blok.media, {
          breakpoints: [
            { breakpoint: 0, width: 540 },
            { breakpoint: 480, width: 600 },
            { breakpoint: 768, width: 1024 },
          ],
          ratio: isFullImage ? (4/1) : (375 / 390)
        })" media="(min-width: 376px) and (max-width: 1023px)"
        sizes="100vw">
      <source
        :srcset="getImageSrcSet(blok.media, {
          breakpoints: [
            { breakpoint: 1024, width: 768, },
            { breakpoint: 1440, width: 1000, },
            { breakpoint: 2048, width: 1300 },
          ],
          ratio: isFullImage ? (4/1) : (852 / 740)
        })" sizes="60vw"
        media="(min-width: 1024px)">
      <img
        :src="getImageSrc(blok.media, { width: 540, ratio: isFullImage ? (4/1) : (375 / 390) })" :alt="blok.media.alt"
        :width="852"
        :height="isFullImage ? 215 : 740">
    </picture>
    <div class="sif-hero-section__scrim" />
    <div class="sif-hero-section__content">
      <SifCmsHeading
        v-if="blok.heading && blok.heading[0]"
        v-editable="blok.heading[0]" :blok="blok.heading[0]" />

      <div
        class="sif-hero-section__content-cta">
        <component
          :is="getSifCmsComponentName(blok.cta[0].component)" v-if="blok.cta && blok.cta.length"
          v-editable="blok.cta[0]" :blok="blok.cta[0]" />
        <component
          :is="getSifCmsComponentName(blok.cta[1].component)" v-if="blok.cta && blok.cta.length && blok.cta[1]"
          v-editable="blok.cta[1]" :blok="blok.cta[1]" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';
import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SifCmsHeading,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { getImageSrcSet, getImageSrc } = useImageResizer();
    const classes = computed(() => [
      ...(props.blok.variants ?? []).map((variant: string) =>
        `sif-hero-section--${variant}`,
      ),
      props.blok.theme ? `theme--${props.blok.theme}` : null,
    ].filter(Boolean).join(' '));


    const isFullImage = computed(() => props.blok.variants.includes('full-image'));

    return {
      classes,

      getSifCmsComponentName,
      hasRichText,
      renderRichText,
      getImageSrcSet,
      getImageSrc,

      isFullImage,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-hero-section {
    --hero-content-top: var(--spacer-lg);
    --hero-content-bottom: var(--spacer-2xl);
    --hero-content-desktop-size: 40%;

    // TODO: set header/top banner height from consumer
    --header-height: 3.75rem;
    --top-banner-height: calc(var(--font-size--body-sm) * 2);
    --hero-top-offset: calc(var(--header-height) + var(--top-banner-height));

    --hero-animation-duration: 1s;
    // we use two animations to achieve the desired effect:
    // - one shrinking panel to reveal the image
    // - a smaller slide animation on the content and image
    --hero-animation-panel-name: shrink-vertical;
    --hero-animation-origin: bottom left;
    --hero-animation-content-name: slide-down;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, auto) max-content;
    grid-template-areas:
      "media"
      "content";

    align-items: stretch;
    justify-items: stretch;

    // make the hero fit screen height, unless comically tall (200vw)
    height: min(calc(100vh - var(--hero-top-offset, 0)), 200vw);
    width: 100%;

    background: var(--theme-background);
    overflow: hidden;

    @include for-desktop {
      // make the hero fit screen height, unless comically tall (75vw)
      height: min(calc(100vh - var(--hero-top-offset, 0)), 75vw);
    }

    /**
     * iPhone 6/7/8 cta fix
     * Combination of:
     * 1. huge bottom notch insert on a relatively small screen
     * 2. well-documented viewport height calculation issue on iOS
     */
    @supports (-webkit-hyphens: none) {
      @media (max-width: 375px) and (max-height: 667px) {
        --hero-content-bottom: 14vh;
      }
    }

    @include for-desktop {
      --hero-content-top: var(--spacer-xl);
      --hero-content-bottom: var(--spacer-base);

      --hero-animation-content-name: slide-left;
      --hero-animation-panel-name: shrink-horizontal;

      grid-template-columns: var(--hero-content-desktop-size) 1fr;
      grid-template-rows: 1fr;
      grid-template-areas:
        "content media";

      &__scrim {
        transform: scaleX(0);
      }

      &--flipped {
        --hero-animation-origin: bottom right;
        --hero-animation-content-name: slide-right;

        grid-template-columns: 1fr var(--hero-content-desktop-size);
        grid-template-areas:
          "media content";

      }
    }

    &--wide {
      --hero-content-desktop-size: 55%;
    }

    > picture {
      grid-area: media;
      background: var(--c-light);
      display: block;
      width: 100%;
      height: 100%;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      max-width: 15ch;
    }

    p,
    span {
      max-width: 40ch;
    }

    // animation panel
    &__scrim {
      margin-right: auto;
      grid-area: media;

      display: block;
      width: 100%;
      height: 100%;
      background: var(--theme-background);

      transform: scaleY(0);
      // TODO: add image/content box transition ala Dept demo
      animation: var(--hero-animation-panel-name) var(--hero-animation-duration) ease-out;
      transform-origin: var(--hero-animation-origin);
    }

    &__content {
      grid-area: content;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;

      padding: var(--hero-content-top) var(--app-gutter) var(--hero-content-bottom);

      // TODO: extract
      background: var(--theme-background);

      &-cta >.sf-button,
      .sticky-cta {
        margin-top: var(--spacer-lg);
      }
    }

    &__content,
    picture {
      transform-origin: var(--hero-animation-origin);
      animation: var(--hero-animation-content-name) var(--hero-animation-duration) ease-out;
    }

    &--full-image {
      --hero-animation-origin: none;
      --hero-animation-content-name: none;

      @include for-desktop {
        grid-template-columns: 1fr;
        grid-template-areas: "media";
        height: fit-content;

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          max-width: 32ch;
        }

        > picture {
          height: fit-content;
        }

        .sif-hero-section__scrim {
          display: none;
        }

        .sf-heading {
          --heading-text-align: center;
        }

        .sif-hero-section__content {
          background: none;
          grid-area: media;
          align-items: center;
          justify-content: center;

          &-cta {
            display: flex;
            gap: var(--spacer-base);

            .sf-button {
              --theme-color: var(--c-neon);
              --theme-background: var(--c-dark-green);

              --button-hover-background: var(--c-dark-green);
            }
          }
        }
      }
    }

    @keyframes slide-down {
      0% {
        transform: translateY(-20%);
      }

      100% {
        transform: translateY(0);
      }
    }

    @keyframes slide-left {
      0% {
        transform: translateX(20%);
      }

      100% {
        transform: translateX(0);
      }
    }

    @keyframes slide-right {
      0% {
        transform: translateX(-20%);
      }

      100% {
        transform: translateX(0);
      }
    }

    @keyframes shrink-vertical {
      0% {
        transform: scaleY(100%);
      }

      100% {
        transform: scaleY(0);
      }
    }

    @keyframes shrink-horizontal {
      0% {
        transform: scaleX(100%);
      }

      100% {
        transform: scaleX(0);
      }
    }
  }
}
</style>
