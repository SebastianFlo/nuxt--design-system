<template>
  <section
    class="sif-faq-section" :class="[
      blok.theme && `theme--${blok.theme}`,
      blok.variants,
    ]">
    <picture v-if="blok.image && blok.image.filename">
      <source
        :srcset="getImageSrcSet(blok.image, {
          breakpoints: [
            { breakpoint: 0, width: 640 },
            { breakpoint: 460, width: 1024 }
          ],
          ratio: 4 / 3
        })" media="(max-width: 1023px)"
        sizes="100vw">
      <source
        :srcset="getImageSrcSet(blok.image, {
          breakpoints: [{ breakpoint: 0, width: 1024 }],
          ratio: 1 / 1
        })" sizes="50vw"
        media="(min-width: 1024px)">
      <img
        :src="getImageSrc(blok.image, { width: 640 })"
        :alt="blok.image.alt">
    </picture>
    <div class="sif-faq-section__content">
      <header>
        <SifCmsHeading
          v-if="blok.heading && blok.heading.length" v-editable="blok.heading[0]"
          :blok="blok.heading[0]" />
        <SifCmsButton
          v-if="blok.cta && blok.cta.length" v-editable="blok.cta[0]"
          :blok="blok.cta[0]"
          :class="[blok.theme && `theme--${blok.theme}`]" />
      </header>
      <SifCmsAccordion :blok="blok" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';
import SifCmsAccordion from '../../molecules/accordion/SifCmsAccordion.vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SifCmsHeading,
    SifCmsAccordion,
  },

  props: {
    blok: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { getImageSrcSet, getImageSrc } = useImageResizer();
    return {
      getImageSrcSet,
      getImageSrc,
      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-faq-section {
    color: var(--theme-color, var(--c-peach));
    background: var(--theme-background, c-creme);

    /*
    * Outer container (optional image & content)
    * - mobile: single column (image: top, content: bottom)
    * - desktop: 2 columns (content: left, image: right).
    */
    display: grid;
    grid-auto-columns: minmax(50%, 1fr); // Image is optional. Desktop + no image = content goes full width.

    @include for-desktop {
      grid-auto-flow: column; // horizontal flow

      &.flipped {
        picture {
          grid-column: 2; // if image is present, right-align it.
        }
      }
    }

    /*
    * Content container (header & FAQ items accordion):
    * - mobile / desktop WITH image: stack vertically (heading: top, accordion: bottom)
    * - desktop no image: stack horizontally (heading: left, accordion: right)
    */
    &__content {
      padding: var(--spacer-base);

      // The heading and accordion elements have a minimum width (approx. what fits on a small screen).
      // If there's space for it, spread out heading and accordion half-n-half in a horizontal 'row', otherwise wrap/stack them in a 'column':
      display: flex;
      flex-wrap: wrap;

      // - Header/Accordion:
      >* {
        flex: 1; // grow to equal widths
        min-width: max(250px, 40vw); // wrap 'breakpoint'.
      }

      header {

        // flow:
        >* {
          margin-bottom: var(--spacer-xl);

          @include for-desktop {
            margin-bottom: var(--spacer-base);
          }
        }

        .sf-heading {
          max-width: 40ch;
        }

        .sf-button {
          display: inline-block; // otherwise, it goes full width.
        }
      }

      .sif-accordion {
        align-self: end;
      }
    }
  }
}
</style>
