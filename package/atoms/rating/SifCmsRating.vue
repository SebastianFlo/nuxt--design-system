<template>
  <SfRating
    :score="parseInt(blok.score)"
    :max="blok.max ? parseInt(blok.max) : 5" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfRating } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfRating,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
