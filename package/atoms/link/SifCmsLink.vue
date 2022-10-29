<template>
  <SfLink :link="convertLinkToLocation(blok.link, { hash: blok.hash })">
    {{ blok.text }}
  </SfLink>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfLink } from '@storefront-ui/vue';
import { convertLinkToLocation, Link } from '../../base/helpers/storyblok-component.helpers';

export default defineComponent({
  components: {
    SfLink,
  },
  props: {
    blok: {
      type: Object as PropType<{
        link: Link,
        hash?: string,
        text: string,
      }>,
      required: true,
    },
  },
  setup() {
    return {
      convertLinkToLocation,
    };
  },
});
</script>
