<template>
  <aside class="[ nav-bar ]">
    <SfCircleIcon
      v-if="!isInEditor"
      icon="list" @click="toggle" />
    <SfSidebar
      v-if="!isInEditor"
      :visible="isOpen" @close="toggle">
      <SfAccordion>
        <SfAccordionItem
          v-for="folder of navFolders"
          :key="folder.name" :header="folder.name">
          <SfList>
            <SfListItem
              v-for="item in folder.items"
              :key="item.name" @click.native="navigate(item.location)">
              <SfMenuItem
                :label="item.name"
                :link="item.location" @click.native="isOpen = false" />
            </SfListItem>
          </SfList>
        </SfAccordionItem>
      </SfAccordion>
    </SfSidebar>
  </aside>
</template>
<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import {
  SfAccordion,
  SfCircleIcon,
  SfList,
  SfMenuItem,
  SfSidebar,
} from '@storefront-ui/vue';
// TODO: move to package?
// TODO: use model?
import { RawLocation } from 'vue-router';
import { Story } from '../package/base/hooks/use-stories';

const folderSorting = [
  'atoms',
  'molecules',
  'organisms',
];

const folderMatcher = /^([^\/]+)\//;

interface NavFolder {
  name: string,
  slug: string,
  items: {
    name: string,
    location: RawLocation,
    story: any;
  }[]
}

export default defineComponent({
  components: {
    SfAccordion,
    SfCircleIcon,
    SfList,
    SfMenuItem,
    SfSidebar,
  },
  props: {
    stories: {
      type: [] as PropType<Story[]>,
      default: () => [],
    },
  },
  data: () => ({
    isOpen: false,
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
    navFolders(): NavFolder[] {
      if (!process.client || !this.stories?.length) {
        return [];
      }

      const folders = [] as NavFolder[];

      for (const story of this.stories) {
        const [, folderSlug] = story.full_slug.match(folderMatcher) ?? [];
        if (!folderSlug) {
          continue;
        }

        let folder = folders.find(folder => folder.slug === folderSlug);

        if (!folder) {
          folder = {
            name: folderSlug.split(/[\-_\s]/).map(part => part[0].toUpperCase() + part.slice(1)).join(' '),
            slug: folderSlug,
            items: [],
          };
          folders.push(folder);
        }

        folder.items.push({
          location: { path: '/' + story.full_slug },
          name: story.name,
          story,
        });
      }

      // Sort the folders by our hardcoded sorting (above)
      folders.sort((src, target) => folderSorting.indexOf(src.slug) - folderSorting.indexOf(target.slug));
      // Sort each item in the folder alphabetically.
      folders.forEach((folder) => folder.items.sort((src, target) => src.name < target.name ? -1 : 1));

      return folders;
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    navigate(location: RawLocation) {
      this.$router.push(location);
      this.isSidebarOpen = false;
    },
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers.scss';

.nav-bar {
  display: flex;
  flex-direction: column;
  --top-space: var(--spacer-sm);

  @include for-desktop {
    --top-space: 40px;
  }

  >.sf-sidebar {
    z-index: var(--z-index-navigation-back);
  }

  >.sf-circle-icon {
    position: fixed;
    top: var(--top-space); // sync with the button in sidebar.
    // TODO: find a better way to sync these using spacer values or custom properties.
    right: var(--spacer-sm);
    z-index: var(--z-index-navigation-back);
  }
}
</style>
