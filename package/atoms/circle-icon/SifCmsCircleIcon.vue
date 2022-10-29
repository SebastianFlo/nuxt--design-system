<template>
  <SfCircleIcon
    :class="classes"
    :icon="blok.icon" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfCircleIcon } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfCircleIcon,
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
        this.blok.theme ? `color-${this.blok.theme}` : null,
        this.blok.variant ? `sf-circle-icon--${this.blok.variant}` : null,
      ].filter(Boolean).join(' ');
    },
  },
});
</script>
