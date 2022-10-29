<template>
  <SifProductCard
    :name="blok.name" :image="blok.image"
    :price="price" :currency="blok.currency"
    :description="blok.description" :quantity="quantity"
    :link="blok.link" @click:add-to-cart="() => addToCart()" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifProductCard from './SifProductCard.vue';

export default defineComponent({
  components: {
    SifProductCard,
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
      price: parseFloat(blok.price),
    };
  },
  methods: {
    renderRichText,
    addToCart() {
      // This is just to test the event listener,
      // No business logic should live here or in Product Card component
      alert('Add to cart event');
    },
  },
});
</script>
