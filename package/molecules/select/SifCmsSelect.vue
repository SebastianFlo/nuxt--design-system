<template>
  <SfSelect
    :class="classes" :value="value"
    :label="blok.label" :placeholder="blok.placeholder"
    :valid="!blok.error"
    :error-message="blok.error" :required="blok.required"
    :disabled="blok.disabled" @input="($value) => value = $value">
    <SfSelectOption
      v-for="option in blok.options"
      :key="option" :value="option">
      {{ option }}
    </SfSelectOption>
  </SfSelect>
</template>

<script lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  components: {
    SfSelect,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    return { value: blok.value ?? '' };
  },
  computed: {
    classes(): string {
      return [
        this.blok.variant ? `sf-select--${this.blok.variant}` : null,
      ]
        .filter(Boolean)
        .join(' ');
    },
  },
});
</script>
