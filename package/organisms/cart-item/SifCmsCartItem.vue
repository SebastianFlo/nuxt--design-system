<template>
  <SifCartItem
    :name="blok.name" :image="blok.image"
    :price="price" :discount-price="discountPrice"
    :price-info="blok.priceInfo" :currency="blok.currency"
    :description="blok.description"
    :discount-text="blok.discountText" :quantity="quantity"
    :quantity-enabled="blok.quantityEnabled"
    :quantity-info="blok.quantityInfo" :link="blok.link"
    :quantity-disabled="!blok.quantityEnabled"
    @remove="() => remove()" @quantity-changed="$value => quantityChanged($value)" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCartItem from './SifCartItem.vue';

export default defineComponent({
  components: {
    SifCartItem,
  },
  props: {
    blok: {
      type: Object as PropType<{
        quantity: string,
        price: string,
        discountPrice: string,
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const quantity = ref(blok.quantity ? parseInt(blok.quantity, 10) : 0);

    const remove = () => {
      alert('remove!');
    };

    const quantityChanged = (value: number) => {
      quantity.value = value;
    };

    return {
      quantity,
      price: blok.price ? parseFloat(blok.price) : 0,
      discountPrice: blok.discountPrice ? parseFloat(blok.discountPrice) : 0,
      remove,
      quantityChanged,
      renderRichText,
    };
  },
});
</script>
