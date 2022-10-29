<template>
  <nuxt-link
    :to="{
      path: `/${page.full_slug}`,
    }">
    {{ page.content.header }}
  </nuxt-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { StoryData } from 'storyblok-js-client';

export default defineComponent({
  props: {
    page: {
      type: Object as PropType<StoryData<{
        header: string,
      }>>,
      required: true,
    },
  },
});
</script>
