<template>
  <div>
    <component
      :is="componentName(story.content.component)"
      v-if="story" :story="story" />
  </div>
</template>
<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api';
import { useStory } from '../package/base/hooks/use-story';
import ExamplePage from '../components/ExamplePage.vue';

export default defineComponent({
  components: {
    ExamplePage,
  },
  layout: 'Base',
  setup() {
    const route = useRoute();
    const slug = (route.value.path === '/' || route.value.path === '') ?
      'home' :
      route.value.path.replace(/^\//, '');

    const story = useStory({ slug });

    return {
      story,
    };
  },
  mounted() {
    this.$storybridge(() => {
      const instance: StoryblokBridge = new window.StoryblokBridge();

      // Use the input event for instant update of content
      instance.on('input', (event) => {
        if (event && event.story.id === this.story.id) {
          this.story.content = event.story.content;
        }
      });

      // Use the bridge to listen the events
      instance.on(['published', 'change'], () => {
        // TODO: reload nuxt using router?
        window.location.reload();
      });
    });
  },
  methods: {
    componentName(name: string) {
      return name.split(/[\s\-]/g)
        .map(part => part[0].toUpperCase() + part.slice(1))
        .join('');
    },
  },
});

</script>

<style lang="scss">
</style>
