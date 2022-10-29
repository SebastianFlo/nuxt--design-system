<template>
  <component
    :is="linkTag"
    class="[ sif-product-upsell-card ]" v-bind="getLocationProps(link)">
    <div
      class="[ sif-product-upsell-card__media ]"
      @click="openDetail && $emit('click:open-detail');">
      <!-- TODO: set sizes and breakpoints from outside consumer -->
      <picture v-if="image.filename">
        <source
          :srcset="getImageSrcSet(image, { width: 150, format: 'webp' })"
          type="image/webp" />
        <img
          :src="getImageSrc(image, { width: 460 })"
          :alt="image.description || image.alt" />
      </picture>
    </div>
    <SfCircleIcon
      class="[ sf-circle-icon ]"
      @click="$event => addToCart($event)">
      <span v-html="require('../../base/icons/cart.svg?raw')" />
    </SfCircleIcon>

    <div class="[ sif-product-upsell-card__content ]">
      <h3>{{ name }}</h3>
      <p>
        {{ description }}
      </p>
      <SfButton
        class="sf-button--pure"
        @click="triggerDetail()">
        {{ detailsLabel }}
      </SfButton>
    </div>
    <SifPrice
      :regular="price"
      :special="discountPrice" :currency="currency" />
  </component>
</template>


<script lang="ts">
import { RawLocation } from 'vue-router';
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api';
import { SfCircleIcon, SfButton } from '@storefront-ui/vue';
import SifPrice from '../../atoms/price/SifPrice.vue';
import { getLocationComponentType, getLocationProps } from '../../base/helpers/storyblok-component.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfButton,
    SfCircleIcon,
    SifPrice,
  },
  props: {
    link: {
      type: [Object, String] as PropType<RawLocation>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: [Number, String] as PropType<number | string>,
      required: true,
    },
    discountPrice: {
      type: [Number, String] as PropType<number | string>,
      default: '',
    },
    currency: {
      type: String as PropType<string>,
      required: true,
    },
    image: {
      type: Object as PropType<{ filename: string, description: string }>,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    detailsLabel: {
      type: String,
      default: '',
    },
    openDetail: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { getImageSrcSet, getImageSrc } = useImageResizer();
    const addToCart = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      emit('click:add-to-cart');
    };

    const linkTag = computed(() => {
      if (props.openDetail) {
        return 'div';
      } else if (typeof props.link === 'string') {
        return 'a';
      }

      return 'nuxt-link';
    });


    const triggerDetail = () => {
      if (!props.openDetail) {
        return;
      }

      emit('click:open-detail');
    };

    return {
      getLocationProps,
      getLocationComponentType,
      linkTag,
      addToCart,
      triggerDetail,
      getImageSrcSet,
      getImageSrc,
    };
  },
});
</script>


<style lang="scss">
.sif-ds {
  .sif-product-upsell-card {
    display: grid;
    grid-template-columns: 7rem 1fr max-content;
    grid-template-rows: repeat(2, min-content);
    grid-template-areas:
      "media content actions"
      "media content price";

    text-decoration: none;
    color: inherit;
    width: 100%;

    align-items: flex-start;
    align-content: flex-start;
    justify-items: flex-start;
    justify-content: flex-start;

    font-size: var(--font-size--body-sm);

    padding: var(--spacer-sm) var(--spacer-sm) var(--spacer-sm) 0;

    h3 {
      font-family: var(--font-family-primary);
      line-height: var(--lh--tighter);
      font-weight: var(--font-weight--bold);
      text-transform: uppercase;
      font-style: italic;
    }

    p {
      line-height: var(--lh--tighter);
      margin-top: .5em;
    }

    &__media {
      --aspect-ratio: 1;
      width: 100%;
      grid-area: media;
      position: relative;
      padding-bottom: calc(var(--aspect-ratio) * 100%);

      >* {
        position: absolute;
        top: 0;
        left: var(--spacer-base);
        width: calc(100% - (2 * var(--spacer-base)));
        height: 100%;
        object-fit: cover;
      }

      img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
      }
    }

    picture {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .sf-circle-icon {
      justify-self: flex-end;
      background: var(--c-neon);
      border: none;
    }

    &__content {
      grid-area: content;
      display: flex;
      flex-direction: column;
      height: 100%;

      // Button disguised as a link, bc. we cannot nest links
      button {
        font-family: var(--font-family--primary);
        align-self: flex-start;
        margin-top: auto;
        font-weight: var(--font-weight--base);
        color: var(--theme-color, var(--c-text));
        text-decoration: underline;
        text-align: left;
      }
    }

    .sif-price {
      grid-area: price;
      justify-self: flex-end;
      align-self: flex-end;
    }
  }
}
</style>
