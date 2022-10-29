<template>
  <SfArrow
    :class="classes"
    :disabled="disabled" :aria-label="blok.label" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfArrow } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfArrow,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes(): string {
      return [
        this.blok.direction ? `sf-arrow--${this.blok.direction}` : null,
      ].filter(Boolean).join(' ');
    },
  },
});
</script>
