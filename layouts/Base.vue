<template>
  <div class="sif-ds base-layout">
    <client-only>
      <NavBar
        v-if="!isInEditor"
        :stories="navBarStories" />
    </client-only>
    <main>
      <Nuxt />
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { useStories } from '../package/base/hooks/use-stories';
import NavBar from '../components/NavBar.vue';

// this list should be updated if we start expanding the different types of pages we want in the top menu
const ALLOWED_NAV_BAR_STORY_TYPES = ['example-page'];

export default defineComponent({
  components: {
    NavBar,
  },
  setup() {
    const stories = useStories();

    const navBarStories = computed(() => {
      if (!stories.value) {
        return null;
      }

      return stories.value.filter(item => ALLOWED_NAV_BAR_STORY_TYPES.includes(item.content.component));
    });

    return {
      navBarStories,
    };
  },
  data: () => ({
    isSidebarOpen: false,
  }),
  computed: {
    isInEditor(): boolean {
      if (!process.client) {
        return false;
      }

      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    },
  },
});
</script>

<style lang="scss">
.base-layout {
  display: flex;
  flex-direction: column;
}
</style>
