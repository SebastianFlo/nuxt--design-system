<template>
  <section class="sif-two-column-layout">
    <!-- Left -->
    <div class="sif-two-column-layout__left">
      <component
        :is="getSifCmsComponentName(subBlok.component)" v-for="subBlok of blok.leftColumn"
        :key="subBlok.uuid"
        v-editable="subBlok" :blok="subBlok" />
    </div>
    <!-- Right -->
    <div class="sif-two-column-layout__right">
      <component
        :is="getSifCmsComponentName(subBlok.component)" v-for="subBlok of blok.rightColumn"
        :key="subBlok.uuid"
        v-editable="subBlok" :blok="subBlok" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';

export default defineComponent({
  components: {
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      getSifCmsComponentName,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-two-column-layout {
    display: flex;

    @include for-mobile {
      flex-direction: column;
    }

    width: 100%;

    padding: var(--spacer-base) var(--app-gutter);
    gap: var(--spacer-base);

    &__right,
    &__left {
      flex: 1;
    }
  }
}
</style>
