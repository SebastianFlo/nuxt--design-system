<template>
  <SfNotification
    :visible="isOpen"
    :type="blok.type" @click:close="close">
    <div
      v-if="hasRichText(blok.text)" slot="message"
      class="[ sf-notification__message ]"
      v-html="renderRichText($storyapi, blok.text, { unwrap: true })" />
    <SifCmsLink
      v-if="blok.action && blok.action[0]" slot="action"
      v-editable="blok.action[0]"
      class="[ sf-notification__action ]" :blok="blok.action[0]" />
  </SfNotification>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfNotification } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsLink from '../../atoms/link/SifCmsLink.vue';

export default defineComponent({
  components: {
    SifCmsLink,
    SfNotification,
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
  setup({ blok }) {
    return { selected: blok.selected };
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
