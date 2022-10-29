<template>
  <SfOverlay
    :visible="isOpen"
    @click="close" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfOverlay } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfOverlay,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
