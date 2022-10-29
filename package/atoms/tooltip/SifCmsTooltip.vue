<template>
  <div class="sif-tooltip">
    {{ blok.label }}

    <span
      class="sif-tooltip__text"
      :class="'sif-tooltip--direction-' + blok.direction">{{ blok.label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
