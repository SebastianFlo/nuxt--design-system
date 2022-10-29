<template>
  <section
    class="sif-vertical-layout"
    :class="'sif-vertical-layout--' + blok.align">
    <component
      :is="getSifCmsComponentName(subBlok.component)" v-for="subBlok of blok.body"
      :key="subBlok.uuid"
      v-editable="subBlok" :blok="subBlok" />
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
  .sif-vertical-layout {
    display: flex;
    flex-direction: column;

    width: 100%;

    padding: var(--spacer-base) var(--app-gutter);
    gap: var(--spacer-base);

    align-items: flex-start;

    &--left {
      align-items: flex-start;
    }
    &--center {
      align-items: center;
    }

    &--right {
      align-items: flex-end;
    }
  }
}
</style>
