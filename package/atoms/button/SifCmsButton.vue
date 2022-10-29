<template>
  <SfButton
    :class="[
      mode && `color-${mode} has-mode`,
      blok.variant === 'secondary' && 'sf-button--outline',
      blok.fullWidth &&'sf-button--full-width',
    ]" :data-mode="mode"
    :disabled="disabled" :link="convertLinkToLocation(blok.link)"
    :type="type">
    {{ blok.text }}
  </SfButton>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfButton } from '@storefront-ui/vue';
import { convertLinkToLocation, Link } from '../../base/helpers/storyblok-component.helpers';

export default defineComponent({
  components: {
    SfButton,
  },
  props: {
    blok: {
      type: Object as PropType<{
        link: Link,
        variant: String,
        text: String,
        fullWidth: Boolean,
      }>,
      required: true,
    },
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<'info' | 'warning' | 'success' | 'danger'>,
      default: '',
    },
  },
  setup() {
    return {
      convertLinkToLocation,
    };
  },
});
</script>
