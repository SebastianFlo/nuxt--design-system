<template>
  <SifPrice
    :regular="blok.regular"
    :currency="blok.currency" :special="blok.special"
    :info="blok.info" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import SifPrice from './SifPrice.vue';

export default defineComponent({
  components: {
    SifPrice,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
