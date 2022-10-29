<template>
  <SifTag
    :icon="blok.icon"
    :name="blok.title || ''" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import SifTag from './SifTag.vue';

export default defineComponent({
  components: {
    SifTag,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="scss">
</style>
