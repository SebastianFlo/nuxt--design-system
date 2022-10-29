<template>
  <SfRadio
    :name="blok.name" :selected="selected"
    :value="blok.value" :disabled="blok.disabled"
    :required="blok.required" @change="$value => $emit('change', $value)">
    <div
      v-if="hasRichText(blok.label)" slot="label"
      class="[ sf-radio__label ]"
      v-html="renderRichText($storyapi, blok.label, { unwrap: true })" />
    <p
      v-if="hasRichText(blok.details)" slot="details"
      class="[ sf-radio__details ]"
      v-html="renderRichText($storyapi, blok.details, { unwrap: true })" />
    <p
      v-if="hasRichText(blok.description)" slot="description"
      class="[ sf-radio__description ]"
      v-html="renderRichText($storyapi, blok.description, { unwrap: true })" />
  </SfRadio>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfRadio } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';

export default defineComponent({
  components: {
    SfRadio,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    selected: {
      type: String,
      default: '',
    },
  },
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>
