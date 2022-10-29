<template>
  <SfBreadcrumbs :breadcrumbs="breadcrumbs" />
</template>

<script lang="ts">
import { RawLocation } from 'vue-router';
import { defineComponent } from '@nuxtjs/composition-api';
import { SfBreadcrumbs } from '@storefront-ui/vue';
import { useStories } from '../../base/hooks/use-stories';

export default defineComponent({
  components: {
    SfBreadcrumbs,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    const stories = useStories({ by_uuids_ordered: blok.items.join(',') });
    return { stories };
  },
  computed: {
    breadcrumbs(): { link: RawLocation | string, text: string }[] {
      return (this.stories ?? []).map(story => ({
        link: { path: story.path },
        text: story.name,
      }));
    },
  },
});
</script>
