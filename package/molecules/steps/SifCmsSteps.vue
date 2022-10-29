<template>
  <SifSteps
    :steps="steps" :can-go-back="blok.canGoBack"
    :can-go-forward="blok.canGoForward"
    :active="blok.active ? parseInt(blok.active) : 0" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { convertLinkToLocation, Link } from '../../base/helpers/storyblok-component.helpers';
import SifSteps from './SifSteps.vue';

export default defineComponent({
  components: {
    SifSteps,
  },
  props: {
    blok: {
      type: Object as PropType<{
        canGoForward: boolean;
        canGoBack: boolean;
        active: string,
        items: {
          link?: Link,
          name: any,
        }[],
      }>,
      required: true,
    },
  },
  setup(props) {
    const steps = computed(() => {
      return props.blok.items.map(item => ({
        link: convertLinkToLocation(item.link ?? null),
        text: item.name,
      }));
    });

    return {
      steps,
    };
  },
});
</script>
