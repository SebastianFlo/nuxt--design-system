<template>
  <SfCheckbox
    :name="blok.name" :disabled="disabled != null ? disabled : blok.disabled"
    :required="blok.required"
    :error-message="error || blok.errorMessage" :info-message="blok.infoMessage"
    :hint-message="blok.hintMessage"
    :valid="!error && !blok.errorMessage" :selected="internalSelected"
    @change="$value => internalSelected = $value">
    <div
      v-if="hasRichText(blok.text)" slot="label"
      class="[ sf-checkbox__label ]"
      v-html="renderRichText($storyapi, blok.text, { unwrap: true })" />
  </SfCheckbox>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api';
import { SfCheckbox } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';

export default defineComponent({
  components: {
    SfCheckbox,
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
    selected: {
      type: Boolean,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: null,
    },
  },
  setup(props) {
    const internalSelected = ref(props.selected ?? props.blok.selected);
    watch(() => props.selected, (value: boolean) => {
      internalSelected.value = value;
    });

    return { internalSelected };
  },
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>

