<template>
  <section
    class="sif-spacer" :class="[blok.theme && `theme--${blok.theme}`,
                                blok.space && `sif-spacer--${blok.space}`,
                                blok.mobileSpace && `sif-spacer--${blok.mobileSpace}__mobile`,
    ]">
    <SfDivider v-if="blok.show_line" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfDivider } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfDivider,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup() { },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-spacer {
    width: 100%;

    background-color: var(--theme-background, transparent);

    .sf-divider {
      border-bottom: none;
    }

    &--lg {
      padding: var(--spacer-3xl) var(--spacer-base);
    }

    &--base {
      padding: var(--spacer-xl) var(--spacer-base);
    }

    &--sm {
      padding: var(--spacer-sm) var(--spacer-base);
    }

    @include for-mobile {
      &--lg__mobile {
        padding: var(--spacer-2xl) var(--spacer-base);
      }

      &--base__mobile {
        padding: var(--spacer-base) var(--spacer-base);
      }

      &--sm__mobile {
        padding: var(--spacer-xs) var(--spacer-base);
      }
    }
  }
}
</style>
