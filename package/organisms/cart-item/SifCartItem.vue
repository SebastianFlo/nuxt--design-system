<template>
  <div class="sif-cart-item">
    <picture
      v-if="image.filename"
      @click="() => $emit('click:media')">
      <source
        :srcset="getImageSrcSet(image, { width: 150, format: 'webp' })"
        type="image/webp" />
      <img
        :src="getImageSrc(image, { width: 150 })"
        :alt="image.description || image.alt" />
    </picture>
    <div class="sif-cart-item__text">
      <h2>{{ name }}</h2>
      <p>{{ description }}</p>
      <span
        v-if="discountText"
        class="sif-cart-item__discount-text">{{ discountText }}</span>
    </div>
    <SfButton
      v-if="canRemove"
      class="sif-cart-item__remove sf-button--pure" @click="remove">
      <img
        :src="require('../../base/icons/trash-can.svg')"
        width="15" height="17" />
    </SfButton>
    <div class="sif-cart-item__quantity">
      <SfQuantitySelector
        v-if="!quantityDisabled"
        :qty="internalQuantity" @input="quantityChanged" />
      <p v-if="quantityDisabled">
        {{ interpolate(quantityLabel, [internalQuantity]) }}
      </p>
    </div>
    <SifPrice
      :regular="price"
      :currency="currency" :special="discountPrice"
      :info="priceInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from '@nuxtjs/composition-api';
import { SfQuantitySelector, SfButton } from '@storefront-ui/vue';
import SifPrice from '../../atoms/price/SifPrice.vue';
import { interpolate } from '../../base/helpers/string.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfQuantitySelector,
    SifPrice,
    SfButton,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Object as PropType<{ filename: string, alt: string }>,
      default: () => ({}),
    },
    description: {
      type: String,
      default: '',
    },
    discountText: {
      type: String,
      default: '',
    },
    price: {
      type: [Number, String] as PropType<number | string>,
      required: true,
    },
    discountPrice: {
      type: [Number, String] as PropType<number | string>,
      default: 0,
    },
    priceInfo: {
      type: String as PropType<string>,
      default: '',
    },
    canRemove: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    quantity: {
      type: Number as PropType<number>,
      default: 0,
    },
    quantityLabel: {
      type: String as PropType<string>,
      default: 'qty: {0}',
    },
    quantityDisabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    currency: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { getImageSrc, getImageSrcSet } = useImageResizer();

    // Optimistic internal quantity, that still keeps in sync with consumer values.
    // NOTE: in rare cases this _can_ lead to blinks of values which get reverted by api responses.
    // Ideally we should handle those api responses with error states and messaging instead.
    const internalQuantity = ref(props.quantity);

    watch(() => props.quantity, value => {
      internalQuantity.value = value;
    });

    const quantityChanged = (value: number) => {
      emit('quantity-changed', value);
      // optimistically update internal value
      internalQuantity.value = value;
    };

    const remove = () => emit('remove');

    return {
      internalQuantity,
      getImageSrc,
      getImageSrcSet,
      interpolate,
      quantityChanged,
      remove,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sif-cart-item {
    display: grid;
    grid-template-columns: 7.31rem 1fr auto;
    grid-template-rows: 1fr auto;

    grid-column-gap: var(--spacer-base);

    grid-template-areas:
      "media   text   text "
      "media quantity price";

    width: 100%;

    picture {
      grid-area: media;

      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: relative;

      // aspect ratio hack
      width: 100%;
      height: 0;
      padding-bottom: calc(150/117 * 100%);

      &:after {
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        outline: var(--border-base);
      }

      img {
        position: absolute;
        top: 17.333%;
        left: 25%;
        width: 50%;
        height: 65.333%;
        object-fit: contain;
      }
    }

    &--full-image picture {
      align-items: stretch;

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }

    &__text {
      grid-area: text;
      justify-self: flex-start;
      display: flex;
      flex-direction: column;

      h2 {
        font-size: var(--font-size--body-base);
        font-weight: var(--font-weight--medium);
        max-width: 15ch;
        line-height: var(--lh--tighter);
      }

      p {
        font-size: var(--font-size--body-sm);
      }
    }

    &__discount-text {
      font-style: italic;
      font-weight: var(--font-weight--bold);
      color: var(--c-blue);
      text-transform: uppercase;
      font-size: var(--font-size--body-xs);
      line-height: var(--lh--tight);
    }

    &__remove {
      grid-column: 3/4;
      grid-row: 1/2;
      justify-self: flex-end;
      align-self: flex-start;
    }

    &__quantity {
      grid-area: quantity;
      align-self: flex-end;
      justify-self: flex-start;

      >p {
        font-size: var(--font-size--body-sm);
        line-height: var(--lh--loose);
      }
    }

    .sif-price {
      grid-area: price;
      align-self: flex-end;
    }
  }
}
</style>
