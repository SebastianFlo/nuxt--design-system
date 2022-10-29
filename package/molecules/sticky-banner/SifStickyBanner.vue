<template>
  <aside class="[ sticky-banner ] [ box-shadow ]">
    <slot />
    <SfButton :link="link">
      {{ linkText }}
    </SfButton>
  </aside>
</template>

<script lang="ts">
import { RawLocation } from 'vue-router';
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfButton } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfButton,
  },
  props: {
    link: {
      type: Object as PropType<RawLocation>,
      required: true,
    },
    linkText: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sticky-banner {
    display: flex;
    align-items: center;
    justify-content: center;

    --gutter: var(--spacer-sm);

    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: var(--spacer-sm) var(--gutter);
    background: var(--c-light-lighten);
    // overflow: hidden; (needed for dropdown)

    >* {
      max-width: 60ch;
    }

    >*+* {
      margin-left: var(--spacer-base);
    }

    @include for-desktop {
      --gutter: var(--spacer-xl);
    }
  }
}
</style>
