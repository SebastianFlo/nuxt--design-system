<template>
  <SfProperty
    :name="blok.name"
    :value="blok.value" :class="classes" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfProperty } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfProperty,
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
        this.blok.variant ? `sf-property--${this.blok.variant}` : null,
      ]
        .filter(Boolean)
        .join(' ');
    },
  },
});
</script>
