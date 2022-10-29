<template>
  <div class="sif-region-switcher theme--neon_dark-green">
    <SfDropdown
      :is-open="isOpen"
      @click:open="() => isOpen = !isOpen" @click:close="() => isOpen = false">
      <button
        slot="opener"
        class="sf-link sf-dropdown__opener" @click.stop="() => isOpen = true">
        {{ blok.label }}
      </button>
      <SfList>
        <SfListItem
          v-for="region in regions"
          :key="region.value">
          <SfButton
            class="sf-button--underlined color-primary" :class="{
              'is-active': activeRegion === region
            }"
            :link="'/' + region.value" @click.stop="itemClicked">
            {{ region.name }}
          </SfButton>
        </SfListItem>
      </SfList>
    </SfDropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { SfButton, SfDropdown, SfList } from '@storefront-ui/vue';
import { useRegion } from '../../base/hooks/use-region';

export default defineComponent({
  components: {
    SfButton,
    SfDropdown,
    SfList,
  },
  props: {
    blok: {
      type: Object as PropType<{
        regions: { value: string }[]
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const { region } = useRegion();
    const isOpen = ref(false);

    const activeRegion = computed(() => blok.regions.find(({ value }) => value === region.value));
    const regions = computed(() => [...blok.regions].sort((item) => item === activeRegion.value ? -1 : 1));

    const itemClicked = (event: Event) => {
      event.preventDefault();

      window.location.href = (event.target as HTMLAnchorElement).href;
      isOpen.value = false;
    };

    return {
      activeRegion,
      regions,
      isOpen,
      itemClicked,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sif-region-switcher {
    --region-switcher-font-size: var(--font-size--body-base);
    font-size: var(--region-switcher-font-size);
    color: var(--c-dark);

    .sf-dropdown {
      --dropdown-container-top: calc(var(--lh--base) * 1em + var(--spacer-sm));

      li a {
        // --theme-color: var(--c-light);
        // --theme-background: var(--c-text);
        border-bottom-color: var(--c-text);
      }

      .sf-button.is-active {
        --theme-color: var(--c-text-disabled);
      }
    }

    .sf-dropdown__opener {
      display: flex;
      padding: 0;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
