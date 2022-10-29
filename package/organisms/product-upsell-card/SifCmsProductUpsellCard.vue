<template>
  <SifProductUpsellCard
    :name="blok.name" :description="blok.description"
    :image="blok.image" :price="blok.price"
    :discount-price="blok.discountPrice" :currency="blok.currency"
    :details-label="blok.detailsLabel"
    :quantity="quantity" :link="convertLinkToLocation(blok.link)"
    @click:add-to-cart="() => addToCart()" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { convertLinkToLocation } from '../../base/helpers/storyblok-component.helpers';
import SifProductUpsellCard from './SifProductUpsellCard.vue';
export default defineComponent({
  components: {
    SifProductUpsellCard,
  },
  props: {
    blok: {
      type: Object as PropType<{
        quantity: number,
        price: string,
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const quantity = ref(blok.quantity);

    return {
      quantity,
    };
  },
  methods: {
    renderRichText,
    addToCart() {
      // This is just to test the event listener,
      // No business logic should live here or in Product Card component
      alert('Add to cart event');
    },
    convertLinkToLocation,
  },
});
</script>
