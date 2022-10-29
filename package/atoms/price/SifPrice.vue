<template functional>
  <div
    :class="[
      data.class,
      data.staticClass,
      'sif-price',
      props.special && 'sif-price--has-special'
    ]" :style="[data.style, data.staticStyle]"
    v-bind="data.attrs" v-on="listeners">
    <span class="sif-price__currency">
      {{ props.currency }}
    </span>
    <span
      v-if="!props.special"
      class="sif-price__regular">
      {{ props.regular }}
    </span>
    <del
      v-if="props.special"
      class="sif-price__old">
      {{ props.regular }}
    </del>
    <ins
      v-if="props.special"
      class="sif-price__special">
      {{ props.special }}
    </ins>
    <span
      v-if="props.info"
      class="sif-price__info">
      {{ props.info }}
    </span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    /**
     * The regular non discounted price.
     */
    regular: {
      type: [String, Number],
      default: null,
    },
    /**
     * Optional special discounted price
     */
    special: {
      type: [String, Number],
      default: null,
    },
    /**
     * Currency, using DKK, SEK, USD format (not symbol)
     */
    currency: {
      type: String,
      required: true,
    },
    /**
     * Optional info text, ex: '/per week'
     */
    info: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers';

.sif-ds {
  .sif-price {
    --price-font-size: var(--font-size--title-sm);

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr auto;
    justify-items: flex-end;
    color: var(--theme-color, c-text);

    grid-template-areas:
      "    .      old "
      "currency  price"
      "  info     info";

    line-height: var(--lh--flat); // it's hard to line up numbers in mabry

    &__regular {
      grid-area: price;
    }

    &__special,
    &__regular {
      font-size: var(--price-font-size);
    }

    &__special {
      grid-area: price;
      text-decoration: none;
    }

    &__old,
    &__info,
    &__currency {
      font-size: var(--font-size--body-2xs);
      line-height: var(--lh--tighter);
    }

    &__old {
      grid-area: old;
      text-decoration: line-through;
    }

    &__currency {
      grid-area: currency;
      text-transform: uppercase;
      margin-right: .4em;
    }

    &--has-special &__currency,
    &__special {
      color: var(--c-blue);
    }

    &__info {
      grid-area: info;
      line-height: var(--lh--tight);
    }
  }
}
</style>
