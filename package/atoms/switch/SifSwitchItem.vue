
<template>
  <label class="sif-switch-item">
    <div>{{ label }}</div>
    <div class="sif-switch-item__description">
      <slot name="description" />
    </div>
    <input
      type="radio"
      :checked="selected" :name="name" />
  </label>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-switch-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: var(--spacer-3xs) var(--spacer-sm);
    overflow: hidden;
    min-height: 3em;

    font-size: var(--font-size-body--sm);
    font-weight: var(--font-weight--normal);

    cursor: pointer;
    border-radius: 4em;

    z-index: var(--z-index-content-front);

    &:hover {
      background-color: var(--c-neon-opacity-20);
    }

    &__description {
      font-size: var(--font-size--body-xs);
      font-weight: var(--font-weight--light);
      line-height: var(--lh--flat);
      text-align: center;
    }

    input {
      // Hide visually, but stay visible for screen readers
      opacity: 0;
      left: -1000%;
      width: 1px;
      height: 1px;
    }
  }
}
</style>
