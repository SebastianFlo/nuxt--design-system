<template>
  <SfModal
    :visible="isOpen" :title="blok.title"
    :class="blok.theme && `theme--${blok.theme}`"
    :cross="blok.disableCross !== true" @close="() => $emit('close')">
    <h2 v-html="renderRichText($storyapi, blok.headline, { unwrap: true })" />
    <p
      v-if="hasRichText(blok.description)"
      v-html="renderRichText($storyapi, interpolate(blok.description, values || []), { unwrap: true })" />
    <div
      class="[ sf-modal__ctas ]"
      @click="() => $emit('close')">
      <SifCmsButton
        v-if="blok.secondaryCTA && blok.secondaryCTA[0]" slot="secondary-cta"
        v-editable="blok.secondaryCTA[0]" class="secondary-cta"
        :blok="blok.secondaryCTA[0]"
        @click.native="() => $emit('click:secondary-cta')" />
      <SifCmsButton
        v-if="blok.primaryCTA && blok.primaryCTA[0]" slot="primary-cta"
        v-editable="blok.primaryCTA[0]"
        :blok="blok.primaryCTA[0]" @click.native="() => $emit('click:primary-cta')" />
    </div>
  </SfModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfModal } from '@storefront-ui/vue';
import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsButton from '../../atoms/button/SifCmsButton.vue';
import { interpolate } from '../../base/helpers/string.helpers';

export default defineComponent({
  components: {
    SfModal,
    SifCmsButton,
  },
  props: {
    blok: {
      type: Object as PropType<{
        description: any,
      }>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    values: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup() {
    return {
      hasRichText,
      renderRichText,
      interpolate,
    };
  },
});
</script>
