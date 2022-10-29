<template>
  <SfBadge
    :class="[
      blok.variant && `sf-badge--${blok.variant}`,
      blok.theme && `theme--${blok.theme}`
    ]">
    {{ blok.label }}
  </SfBadge>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfBadge } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfBadge,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
