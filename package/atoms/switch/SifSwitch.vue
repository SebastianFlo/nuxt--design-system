<template>
  <div
    class="sif-switch" :class="{
      'is-animating-left': prevInnerSelectedIndex > innerSelectedIndex,
    }"
    :style="{
      '--switch-index': innerSelectedIndex,
      '--switch-items': itemsCount,
    }" @click="($event) => selectItem($event)">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineComponent, computed, ref, watch } from '@nuxtjs/composition-api';

import SifSwitchItem from './SifSwitchItem.vue';
// Define the item component, so consumers don't have to import both this and item component.
Vue.component('SifSwitchItem', SifSwitchItem);

export default defineComponent({
  props: {
    selectedIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit, slots }) {
    // mirror value to allow for optimistic updates,
    // without waiting for the outside to pass in the updated index.
    const innerSelectedIndex = ref(props.selectedIndex);
    const prevInnerSelectedIndex = ref(props.selectedIndex);

    const items = computed(() =>
      (slots.default && slots.default() || [])
        .filter(item => item.tag?.includes('SifSwitchItem')),
    );
    const itemsCount = computed(() => items.value.length);

    // To ease the consumer usages, we add a click listener to this component,
    // and then find the index of the item the click originated from.
    const selectItem = (event: Event) => {
      const targetElement = event.target as HTMLElement;
      const item = items.value.find(({ elm }) => elm === targetElement || elm?.contains(targetElement));

      // If the user managed to click this component without hitting an item,
      // then do nothing
      if (!item) {
        return;
      }

      const index = items.value.indexOf(item);
      innerSelectedIndex.value = index;
      const instance = items.value[index]?.componentInstance as any;

      // notify consumer
      emit('change', { value: instance.value, index });
    };

    // Keep the inner values up to date when changed from the outside.
    watch(() => props.selectedIndex, (value, prevValue) => {
      prevInnerSelectedIndex.value = prevValue;
      innerSelectedIndex.value = value;
    });

    return {
      innerSelectedIndex,
      prevInnerSelectedIndex, // used for animation
      itemsCount,

      selectItem,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-switch {
    --switch-index: 0;
    --switch-items: 0;
    // this is the distance from the border to the button-like
    // item elements
    --switch-inner-pad: 4px;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    position: relative;

    padding: var(--switch-inner-pad);

    border-radius: 4em;
    border: thin solid var(--theme-color, var(--c-text));

    color: var(--theme-color, var(--c-text));

    &::before {
      content: "";
      position: absolute;

      display: block;
      // using left/right values, we can then use a staggered animation,
      // where the left and right is slightly out of sync,
      // causing a "squish" animation.
      left: max(var(--switch-inner-pad), calc(100% / var(--switch-items) * var(--switch-index)));
      right: max(var(--switch-inner-pad), calc(100% - (100% / var(--switch-items) * (var(--switch-index) + 1))));
      margin: var(--switch-inner-pad) 0;
      top: 0;
      bottom: 0;

      background: var(--theme-background, var(--c-primary));
      border-radius: 4em;

      transition:
        right .35s var(--ease-in-out-1),
        left .35s var(--ease-in-out-1) .14s;

      z-index: var(--z-index-content-back);
    }

    // Reverse the staggered animation when going from right to left.
    &.is-animating-left::before {
      transition:
        left .35s var(--ease-in-out-1),
        right .35s var(--ease-in-out-1) .14s;
    }
  }
}
</style>
