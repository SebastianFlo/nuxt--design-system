<template>
  <SfBullets
    :total="parseInt(blok.total, 10)"
    :current="parseInt(blok.current, 10)" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfBullets } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfBullets,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
