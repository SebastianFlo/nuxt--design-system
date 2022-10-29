<template>
  <SfIcon
    :icon="blok.icon"
    :class="classes" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfIcon } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfIcon,
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
        this.blok.color ? `color-${this.blok.color}` : null,
        this.blok.size ? `size-${this.blok.size}` : null,
      ]
        .filter(Boolean)
        .join(' ');
    },
  },
});
</script>
