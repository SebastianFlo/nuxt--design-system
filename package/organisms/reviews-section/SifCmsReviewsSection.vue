<template>
  <section
    class="[ sif-reviews-section ]"
    :class="[blok.theme && `theme--${blok.theme}`]">
    <div>
      <SifCmsHeading
        v-if="blok.heading && blok.heading.length"
        v-editable="blok.heading[0]" :blok="blok.heading[0]" />
    </div>
    <div class="[ sif-reviews-section__items ]">
      <ul v-if="blok.reviews && blok.reviews.length">
        <template v-for="(review, index) in blok.reviews">
          <span
            v-if="index !== 0"
            :key="review.id" />
          <li
            :key="review.id"
            v-editable="review" class="has-overlap">
            <div>
              {{ review.author }}
            </div>
            <div v-html="renderRichText($storyapi, review.text)" />
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';

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
  setup() {
    return {
      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-reviews-section {
    --reviews-color: var(--theme-color, var(--c-text));
    --reviews-color-opacity-10: var(--theme-color-opacity-10, var(--c-red-opacity-10));
    --reviews-color-opacity-20: var(--theme-color-opacity-20, var(--c-red-opacity-20));

    color: var(--reviews-color);
    background: var(--theme-background, --c-creme);

    padding: var(--spacer-base) 0;

    /*
    * Content container layout:
    * - mobile: single column
    * - desktop: 2 columns (heading on the left, reviews on the right)
    */
    display: grid;
    gap: var(--spacer-base);
    grid-template-columns: 1fr;

    @include for-desktop {
      grid-template-columns: 1fr 1fr;
      padding: var(--spacer-lg) 0 var(--spacer-2xl) 0;
    }

    /* Header area: */
    >div:first-child {
      padding: 0 var(--app-gutter);
      margin-bottom: 2em;

      h1,
      h2 {
        margin-bottom: .85em;
        max-width: 20ch;
      }
    }

    /* Reviews area: */
    &__items {
      border-top: 1px solid var(--reviews-color);
      margin: 0 var(--app-gutter);

      // little offset in the design from the heading top.
      // so we are on purpose not aligning to heading.
      margin-top: var(--spacer-xs);

      ul {
        margin: 0;
        padding: 0;

        /* Review item: */
        li {
          list-style-type: none;
          padding: var(--spacer-base) 0;

          @include for-mobile {
            padding-right: var(--spacer-sm);
          }

          @include for-desktop {
            border-bottom: 1px solid var(--reviews-color);
          }

          /* Author: */
          &>*:first-child {
            line-height: var(--lh--flat);
            font-size: var(--font-size--body-sm);
          }

          /* Review text */
          &>*:nth-child(2) {
            font-family: var(--font-family--secondary);
            font-weight: var(--font-weight--light);
            line-height: var(--lh--tight);
            font-size: var(--font-size--title-sm);
            margin-top: 1em;
            margin-bottom: 1em;
          }
        }

        /* vertical delimiter (between reviews): */
        @include for-mobile {
          span {
            border-left: 1px solid var(--reviews-color-opacity-20);
            margin-top: 1em;
            margin-bottom: 1em;
            margin-right: 1em;
          }
        }
      }
    }

    // Slider element:
    @include for-mobile {
      &__items {
        overflow-x: hidden;
        margin-right: 0;
        // Right part of the track should touch the screen boundary, to visually communicate that content stretches beyond.

        // Slider scrollbar styles:
        // TODO replace with a scrollbar utility...
        ::-webkit-scrollbar {
          height: 2px;
        }

        ::-webkit-scrollbar-track {
          background-color: var(--reviews-color-opacity-10);
        }

        ::-webkit-scrollbar-thumb {
          background-color: var(--reviews-color);
        }

        /* slider track: */
        ul {
          display: flex;
          overflow-x: auto;

          // Touch
          scroll-snap-type: x mandatory; // make the “slides” line up nicely
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch; // making it swipable
        }

        /* slider items: */
        li {
          // Allows room for next slide in row to be partially visible, hinting there's more content.
          min-width: 70%;

          // add space down to scrollbar:
          margin-bottom: var(--spacer-base);

          // Touch
          scroll-snap-align: start;
        }
      }
    }
  }
}
</style>
