<template>
  <SfChevron :class="classes" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfChevron } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfChevron,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  computed: {
    classes(): string {
      return [
        this.blok.direction ? `sf-chevron--${this.blok.direction}` : null,
      ].filter(Boolean).join(' ');
    },
  },
});
</script>
