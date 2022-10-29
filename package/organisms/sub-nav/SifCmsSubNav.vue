<template>
  <aside
    ref="content"
    class="sif-sub-nav">
    <div
      v-if="!isMobile"
      class="sif-sub-nav__header">
      {{ header }}
    </div>
    <button
      v-if="isMobile"
      class="sif-sub-nav__header" @click="toggleSidebar">
      {{ header }}
      <div v-html="require('../../base/icons/arrow-right.svg?raw')" />
    </button>
    <div
      v-if="!isMobile"
      class="sif-sub-nav__links">
      <SifCmsLink
        v-for="link in blok.items"
        :key="link.uuid" v-editable="link"
        :blok="link" />
    </div>
    <SfSidebar
      v-if="isMobile" :visible="isSidebarOpen"
      :title="header" class="sf-sidebar--right"
      @close="toggleSidebar">
      <div
        class="sif-sub-nav__links"
        @click="toggleSidebar">
        <SifCmsLink
          v-for="link in blok.items"
          :key="link._uid" v-editable="link"
          :blok="link" />
      </div>
      <SfBar
        slot="bar"
        :close="true" @click:close="() => toggleSidebar()" />
    </SfSidebar>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { SfSidebar, SfBar } from '@storefront-ui/vue';
import SifCmsLink from '../../atoms/link/SifCmsLink.vue';
import { interpolate } from '../../base/helpers/string.helpers';
import { useDeviceInfo } from '../../base/hooks/use-device-info';

export default defineComponent({
  components: {
    SifCmsLink,
    SfSidebar,
    SfBar,
  },
  props: {
    blok: {
      type: Object as PropType<{
        header: string
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const content = ref<HTMLElement | null>(null);
    const { isMobile } = useDeviceInfo();
    const usesSidebar = computed(() => isMobile.value);
    const isSidebarOpen = ref(false);
    const header = computed(() => interpolate(blok.header, ['']));

    const toggleSidebar = () => {
      if (usesSidebar.value) {
        isSidebarOpen.value = !isSidebarOpen.value;
      }
    };

    return {
      content,

      header,
      isSidebarOpen,
      isMobile,

      toggleSidebar,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers.scss';

.sif-ds {
  .sif-sub-nav {
    // TODO: extract, not decided yet.
    --header-height: calc(3.75rem - 1px);

    position: sticky;
    top: 0;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @include for-desktop {
      top: var(--header-height);
      width: auto;
    }

    @include for-mobile {
      background: var(--c-light);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: .5em var(--spacer-sm);
      background: none;

      font-weight: var(--font-weight--normal);
      text-align: left;
      font-size: inherit;
      border: none;
      border-bottom: var(--border-base);
      outline: none;
      text-transform: uppercase;

      // toggling is only enabled on mobile
      @include for-mobile {
        width: 100%;
        cursor: pointer;
        padding: 1em var(--app-gutter);
      }

      @include for-desktop {
        border-right: var(--border-base);
      }

      div {
        display: flex;
        width: 1.5em;
        height: 1.5em;
      }

      svg {
        height: auto;
      }
    }

    .sf-sidebar {
      width: 100%;
      --sidebar-content-padding: 0;
      --sidebar-height: auto;
      --sidebar-bottom: auto;

      &__top {
        display: none;
      }
    }

    .sf-bar {
      --bar-height: var(--header-height);
      --bar-padding: 0 var(--app-gutter);
      border-bottom: 1px solid var(--c-dark);
    }

    &__links {
      display: flex;
      flex-direction: column;

      @include for-desktop {
        align-items: flex-end;
        padding-right: var(--spacer-sm);
        padding-bottom: 1em;
        border-right: var(--border-base);
      }
    }

    .sf-link {
      @include for-mobile {
        text-decoration: none;
        padding: 1em var(--app-gutter);
        border-bottom: var(--border-base);
      }

      @include for-desktop {
        margin-top: var(--spacer-xs);
        font-weight: var(--font-weight--light);
      }

      &:hover,
      &:active {
        --link-color: var(--c-blue-darken);
      }
    }
  }
}
</style>
