<template>
  <SfDivider />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfDivider } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfDivider,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
