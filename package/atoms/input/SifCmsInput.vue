<template>
  <SfInput
    :type="blok.type" :value="internalValue"
    :name="blok.name" :label="blok.label"
    :placeholder="blok.placeholder" :valid="!error && !blok.error"
    :error-message="error || blok.error"
    :required="blok.required" :pattern="blok.pattern || undefined"
    :minlength="blok.minLength || undefined"
    :disabled="disabled != null ? disabled : blok.disabled" :has-show-password="blok.type === 'password'"
    @input="onInput" @keyup.enter="onEnter" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api';
import { SfInput } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfInput,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    error: {
      type: String,
      default: '',
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
    const internalValue = ref<string | null>(props.value ?? props.blok.value);

    const onInput = ($value) => {
      internalValue.value = $value;
      emit('input', $value);
    };

    const onEnter = () => {
      emit('enter');
    };

    watch(() => props.value, (value: string) => {
      internalValue.value = value;
    });

    return { internalValue, onInput, onEnter, emit };
  },
});
</script>
