<template>
  <aside
    class="[ sif-top-banner ]" :class="[
      `theme--${blok.theme}`
    ]">
    <div v-html="renderRichText($storyapi, blok.text, { unwrap: true })" />
  </aside>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { renderRichText } from '../../base/helpers/storyblock-richtext.helper';

export default defineComponent({
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  methods: {
    renderRichText,
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sif-top-banner {
    --top-banner-background: var(--theme-background);
    --top-banner-color: var(--theme-color, var(--c-text));

    display: flex;
    overflow-x: auto;

    background: var(--top-banner-background);
    font-size: var(--font-size--body-sm);
    color: var(--top-banner-color);

    padding: .25em var(--app-gutter);

    z-index: var(--z-index-navigation-front);

    >div {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 100%;

      >p {
        display: inline-block;
      }

      >p+p::before {
        content: "|";
        display: inline;
        margin: 0 var(--spacer-lg);
        color: var(--theme-color);
      }

      img {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 2px; // TODO: is there a better way to adjust this?
        margin-right: 1ch;
        max-height: 1rem;
      }
    }

    i {
      font-weight: 700;
    }

    b {
      font-style: italic;
    }

    a {
      color: inherit;
    }
  }
}
</style>
