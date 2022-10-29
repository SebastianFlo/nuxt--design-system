<template>
  <SfAddToCart :disabled="blok.disabled">
    <SifCmsQuantitySelector
      v-if="blok.quantitySelector" slot="quantity-select-input"
      v-editable="blok.quantitySelector[0]" :blok="blok.quantitySelector[0]"
      class="[ sf-add-to-cart__select-quantity ]" />

    <SifCmsButton
      v-if="blok.button" slot="add-to-cart-btn"
      v-editable="blok.button[0]" :blok="blok.button[0]"
      class="[ sf-add-to-cart__button ]" />
  </SfAddToCart>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfAddToCart } from '@storefront-ui/vue';
import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsQuantitySelector from '../../atoms/quantity-selector/SifCmsQuantitySelector.vue';
import SifCmsButton from '../../atoms/button/SifCmsButton.vue';

export default defineComponent({
  components: {
    SfAddToCart,
    SifCmsQuantitySelector,
    SifCmsButton,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    return {
      quantity: blok.quantity ? parseInt(blok.quantity, 10) : 1,
    };
  },
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>
