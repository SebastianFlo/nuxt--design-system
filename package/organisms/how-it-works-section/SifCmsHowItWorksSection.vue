<template>
  <section
    class="[ sif-how-it-works-section ]"
    :class="[
      blok.theme && `theme--${blok.theme}`
    ]"
  >
    <div
      v-for="item in blok.items"
      :key="item._uid"
      v-editable="item"
    >
      <template v-if="item.icon">
        <span
          class="[ sif-how-it-works-section__icon-wrapper ]"
          v-html="require(`../../base/illustrations/${item.icon}.svg?raw`)"
        />
      </template>
      <h2
        v-html="renderRichText($storyapi, item.headline, { unwrap: true })"
      />
      <p
        v-html="renderRichText($storyapi, item.text, { unwrap: true })"
      />
    </div>
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
  methods: {
    hasRichText,
    renderRichText,
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers';

.sif-ds {
  .sif-how-it-works-section {
    // TODO: extract/align with section side padding
    --how-it-works-section-gutter: var(--spacer-base);
    // TODO: what is this light color thingy?
    --how-it-works-background: var(--theme-background, transparent);
    --how-it-works-color: var(--theme-color, var(--c-blue));

    width: 100%;
    color: var(--how-it-works-color);

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);

    width: 100%;
    overflow: hidden;

    text-align: center;
    background: var(--how-it-works-background);

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      padding: 18% 13.2% 23.9% 13.2%;

      // border between rows
      @include for-mobile {
        &:nth-child(2n - 1)::after {
          content: "";
          display: block;
          position: absolute;
          width: 1px;
          top: var(--spacer-base);
          bottom: var(--spacer-base);
          right: 0;
          background: var(--border-base-color);
        }

        &:nth-child(1)::before,
        &:nth-child(2)::before {
          content: "";
          display: block;
          position: absolute;
          bottom: 0;
          height: 1px;
          background: var(--border-base-color);
        }

        &:nth-child(1)::before {
          left: var(--how-it-works-section-gutter);
          right: 0;
        }

        &:nth-child(2)::before {
          left: 0;
          right: var(--how-it-works-section-gutter);
        }
      }
    }

    @include for-desktop {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 1fr;

      > div {
        min-height: 20vw;
        padding: 23% 18.5%;
      }

      > div + div::after {
        content: "";
        display: block;
        position: absolute;
        width: 1px;
        top: var(--spacer-base);
        bottom: var(--spacer-base);
        left: 0;
        background: var(--border-base-color);
      }
    }

    > div > .sif-how-it-works-section__icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 47%;
      height: 47%;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    h2 {
      font-weight: 400;
      font-size: var(--font-size--title-sm);
      line-height: var(--lh--tighter);
      max-width: 16ch;

      margin-top: calc(var(--lh--tighter) * 1em);
      // min 2 lines height to align with other elements
      min-height: calc(2em * var(--lh--tighter));
    }

    p {
      font-size: var(--font-size--body-base);
      line-height: var(--lh--base);
      margin-top: calc(var(--lh--base) * 0.5em);
      height: 100%;
    }
  }
}
</style>
