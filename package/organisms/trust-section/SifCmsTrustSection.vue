<template>
  <section class="sif-trust-section">
    <ul class="sif-trust-section__items">
      <li
        v-for="item in blok.items"
        :key="item._uid" v-editable="item">
        <span
          v-if="item.icon" class="sif-trust-section__icon-wrapper ]"
          v-html="require(`../../base/icons/${item.icon}.svg?raw`)" />
        <h2
          v-if="hasRichText(item.headline)"
          v-html="renderRichText($storyapi, item.headline, { unwrap: true })" />
        <p
          v-if="hasRichText(item.text)"
          v-html="renderRichText($storyapi, item.text, { unwrap: true })" />
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';

export default defineComponent({
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-trust-section {
    width: 100%;
    padding: 0 var(--spacer-lg);


    &__items {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: var(--spacer-base);

      padding: var(--spacer-xl) var(--spacer-lg);
      margin: 0;

      list-style: none;
      border-top: var(--border-base);
      border-bottom: var(--border-base);

      @include for-desktop {
        grid-template-columns: repeat(2, 1fr);
        grid-gap: var(--spacer-xl);
        padding: var(--spacer-2xl) var(--spacer-lg);
      }

      >* {
        display: grid;
        grid-template-columns: 1rem 1rem 1fr;
        grid-template-rows: min-content 1fr;
        grid-template-areas:
          "icon . headline"
          "icon .   text  ";

        list-style: none;
        margin: 0;
        padding: 0;
        font-size: var(--font-size--body-sm);
        max-width: 45ch;
      }

      h2 {
        grid-area: headline;
        font-size: var(--font-size--body-lg);
        line-height: var(--lh--tighter);
        font-weight: var(--font-weight--base);
      }

      p {
        grid-area: text;
        line-height: var(--lh--tight);
        margin-top: .33em;
      }
    }

    &__icon-wrapper {
      display: block;
      grid-area: icon;
      margin-top: .5em;
    }
  }
}
</style>
