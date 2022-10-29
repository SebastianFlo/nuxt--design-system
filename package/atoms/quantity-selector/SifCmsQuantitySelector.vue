<template>
  <SfQuantitySelector
    :class="themeClasses" :qty="value"
    :min="blok.min ? parseInt(blok.min) : 1"
    :max="blok.max ? parseInt(blok.max) : 999" :disabled="blok.disabled"
    @input="($value) => value = $value" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfQuantitySelector } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfQuantitySelector,
  },
  props: {
    blok: {
      type: Object as PropType<{
        value: string,
        theme: string,
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const themeClasses = computed(
      () => blok.theme ? [`theme--${blok.theme}`] : [],
    );

    return {
      value: blok.value ? parseInt(blok.value) : 1,
      themeClasses,
    };
  },
});
</script>
