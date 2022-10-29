<template>
  <SfTextarea
    :name="blok.name" :value="internalValue"
    :label="blok.label" :placeholder="blok.placeholder"
    :valid="!blok.errorMessage" :cols="blok.cols ? parseInt(blok.cols) : 40"
    :rows="blok.rows ? parseInt(blok.rows) : 10" :minlength="blok.minlength ? parseInt(blok.minlength) : ''"
    :maxlength="blok.maxlength ? parseInt(blok.maxlength) : ''" :error-message="blok.errorMessage"
    :required="blok.required" :disabled="disabled != null ? disabled : blok.disabled"
    :readonly="blok.readonly"
    :has-show-password="blok.type === 'password'" @input="onInput" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api';
import { SfTextarea } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfTextarea,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: null,
    },
  },
  setup(props, { emit }) {
    const internalValue = ref(props.value ?? props.blok.value);
    watch(() => props.value, (value: string) => {
      internalValue.value = value;
    });

    const onInput = ($value) => {
      internalValue.value = $value;
      emit('input', $value);
    };

    return { internalValue, onInput };
  },
});
</script>
