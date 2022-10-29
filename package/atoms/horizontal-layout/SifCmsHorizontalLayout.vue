<template>
  <section
    class="sif-horizontal-layout"
    :style="padding">
    <component
      :is="getSifCmsComponentName(subBlok.component)" v-for="subBlok of blok.body"
      :key="subBlok.uuid"
      v-editable="subBlok" :blok="subBlok" />
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api';
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
  setup(props) {

    const padding = computed(() => props.blok.padding ? 'padding: var(--spacer-base) var(--app-gutter);' : '');

    return {
      getSifCmsComponentName,
      padding,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-horizontal-layout {
    display: flex;
    justify-content: space-between;

    @include for-mobile {
      flex-direction: column;
    }

    width: 100%;

    gap: var(--spacer-base);
  }
}
</style>
