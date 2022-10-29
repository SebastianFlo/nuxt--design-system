<template>
  <nuxt-link
    :to="{
      path: `/${page.full_slug}`,
    }">
    {{ page.name }}
  </nuxt-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { StoryData } from 'storyblok-js-client';

export default defineComponent({
  props: {
    page: {
      type: Object as PropType<StoryData<{}>>,
      required: true,
    },
  },
});
</script>
