<template>
  <SfBottomModal
    :is-open="isOpen"
    @click:close="close">
    <h2
      slot="title" class="[ sf-bottom-modal__title ]"
      v-html="renderRichText($storyapi, blok.title, { unwrap: true })" />
    <div class="[ sf-bottom-modal__content ]">
      <p
        v-if="hasRichText(blok.description)"
        v-html="renderRichText($storyapi, blok.description, { unwrap: true })" />
      <div class="[ sf-bottom-modal__ctas ]">
        <SifCmsButton
          v-if="blok.secondaryCTA && blok.secondaryCTA[0]" slot="secondary-cta"
          v-editable="blok.secondaryCTA[0]" :blok="blok.secondaryCTA[0]" />
        <SifCmsButton
          v-if="blok.primaryCTA && blok.primaryCTA[0]" slot="primary-cta"
          v-editable="blok.primaryCTA[0]"
          :blok="blok.primaryCTA[0]" />
      </div>
    </div>
    <SfLink
      v-if="hasRichText(blok.closeText)" slot="close-mobile"
      aria-label="Close" @click="close"
      v-html="renderRichText($storyapi, blok.closeText, { unwrap: true })" />
  </SfBottomModal>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfBottomModal, SfLink } from '@storefront-ui/vue';
import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsButton from '../../atoms/button/SifCmsButton.vue';

export default defineComponent({
  components: {
    SfBottomModal,
    SfLink,
    SifCmsButton,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hasRichText,
    renderRichText,
    close() {
      this.$emit('close');
    },
  },
});
</script>
