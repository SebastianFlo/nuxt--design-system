<template>
  <section
    class="[ explainer-section ]"
    :class="[blok.theme && `theme--${blok.theme}`]">
    <SifCmsHeading
      v-if="blok.heading && blok.heading.length"
      v-editable="blok.heading[0]" :blok="blok.heading[0]" />

    <component
      :is="getSifCmsComponentName(blok.cta[0].component)"
      v-if="blok.cta && blok.cta.length"
      v-editable="blok.cta[0]"
      :blok="blok.cta[0]"
    />

    <picture
      v-for="(image, index) in images" :key="image._uid"
      :class="{
        'is-active': index === activeIndex,
        'is-prev': index === prevIndex && index !== activeIndex,
      }">
      <source
        :srcset="getImageSrcSet(image, {
          breakpoints: [{ breakpoint: 0, width: 460 }],
          ratio: 376 / 270
        })" media="(max-width: 1023px)"
        sizes="100vw">
      <source
        :srcset="getImageSrcSet(image, {
          breakpoints: [
            { breakpoint: 1024, width: 720 },
            { breakpoint: 1440, width: 1000 },
            { breakpoint: 2048, width: 1300 },
          ],
          ratio: 704 / 635
        })" sizes="50vw"
        media="(min-width: 1024px)">

      <img
        :src="getImageSrc(image, { width: 460 })"
        :alt="image.alt" width="451"
        height="338">
    </picture>

    <div
      v-if="!images || !images.length || !images[0].filename"
      class="[ explainer-section__image-placeholder ]" />

    <div class="[ explainer-section__items ]">
      <div
        v-for="(item, index) in items" :key="item._uid"
        v-editable="item"
        :class="{ 'is-active': index === activeIndex }">
        <h3
          @click="setActive(index)"
          v-html="renderRichText($storyapi, item.title, { unwrap: true })" />
        <p>{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from '@nuxtjs/composition-api';

import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';

const LOOP_TIME = 4000;

export default defineComponent({
  components: {
    SifCmsHeading,
  },
  props: {
    blok: {
      type: Object as PropType<{
        // eslint-disable-next-line camelcase
        description_items: { image: any }[],
        media: any,
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const { getImageSrcSet, getImageSrc } = useImageResizer();

    let itemInterval = 0;

    const activeIndex = ref(0);
    const prevIndex = ref(0);

    watch(activeIndex, (_, prevValue) => {
      prevIndex.value = prevValue;
    });

    const items = computed(() => {
      return blok.description_items.length ?
        blok.description_items :
        [];
    });

    const images = computed(() => {
      return blok.description_items?.length ?
        blok.description_items.map(item => item.image) :
        [blok.media];
    });

    const loopItems = () => {
      clearInterval(itemInterval);
      activeIndex.value = 0;

      if (!items.value?.length) {
        return;
      }

      // TODO: CMS the interval
      itemInterval = window.setInterval(() => {
        // Make sure the active index loops around the items.
        activeIndex.value = (activeIndex.value + 1) % items.value.length;
      }, LOOP_TIME);
    };

    const setActive = (index: number) => {
      clearInterval(itemInterval);
      activeIndex.value = index;
    };

    onMounted(() => loopItems());

    return {
      items,
      images,
      activeIndex,
      prevIndex,

      setActive,
      getImageSrcSet,
      getImageSrc,
      getSifCmsComponentName,
      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .explainer-section {
    --heading-text-transform: uppercase;

    display: grid;
    grid-template-columns: var(--app-gutter) 1fr var(--app-gutter);
    grid-template-rows: max-content var(--spacer-lg) min-content min-content var(--spacer-lg);
    grid-template-areas:
      "media media media"
      "  .     .     .  "
      "  .  heading  .  "
      "  .  content  .  "
      "  .     .     .  ";

    @include for-desktop {
      grid-template-columns: 50% var(--app-gutter) 1fr var(--app-gutter);
      grid-template-rows: var(--spacer-lg) 1fr max-content var(--spacer-lg);

      grid-template-areas:
        "media .    .    ."
        "media . heading ."
        "media . content ."
        "media .    .    .";
    }

    justify-content: center;
    width: 100%;

    color: var(--theme-color, --c-light-lighten);
    background-color: var(--theme-background, --c-light-lighten);

    >.sf-heading {
      grid-area: heading;
      margin-bottom: var(--spacer-lg);
    }

    > .sf-button {
      grid-area: content;
      width: fit-content;
    }

    .sf-heading__title {
      // TODO: Extract
      max-width: 20ch;
    }

    picture,
    &__image-placeholder {
      grid-area: media;
    }

    &__image-placeholder {
      background: var(--c-light-lighten);
    }

    picture {
      // z-index: var(--z-index-negative);
      opacity: 0;

      &.is-prev {
        // z-index: var(--z-index-content-back);
        transition: opacity .7s ease-in;
      }

      &.is-active {
        // z-index: var(--z-index-content-front);
        opacity: 1;
        transition: opacity .7s ease-out;
      }
    }

    picture,
    &__image-placeholder {
      --aspect-ratio: 338 / 458;
      display: block;
      width: 100%;
      height: 0;
      position: relative;
      padding-bottom: calc(var(--aspect-ratio) * 100%);

      @include for-desktop {
        --aspect-ratio: 635 / 704;
      }
    }

    img {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center;
    }

    &__items {
      grid-area: content;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      >* {
        position: relative;
        border-top: 1px solid var(--theme-color);
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        padding: 1em 0;

        opacity: 0.7;

        font-size: var(--font-size--body-base);
        line-height: var(--lh--tighter);

        @include for-desktop {
          font-size: var(--font-size--title-sm);
          padding: .85em 0;
        }

        &.is-active {
          opacity: 1;

          &::after {
            transform: scaleX(1);
            transition: transform 4s ease-out;
          }
        }

        &::after {
          content: "";
          display: block;

          position: absolute;
          width: 100%;
          height: 2px;
          top: -2px;

          background-color: var(--theme-color);

          transform-origin: left bottom;
          transform: scaleX(0);
        }

        h3 {
          cursor: pointer;
          text-transform: uppercase;
          font-size: inherit;
        }

        &:last-child {
          border-bottom: 1px solid var(--theme-color);
        }
      }
    }
  }
}
</style>
