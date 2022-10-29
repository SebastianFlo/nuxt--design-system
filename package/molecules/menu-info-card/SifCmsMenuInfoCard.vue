<template>
  <div
    class="menu-info-card"
    :class="themeClasses">
    <span
      v-if="blok.icon"
      class="menu-info-card__icon-wrapper"
      v-html="require(`../../base/illustrations/${blok.icon || 'chopping-board-knife'}.svg?raw`)" />

    <p
      v-if="hasRichText(blok.subtitle)" class="menu-info-card__subtitle"
      v-html="renderRichText($storyapi, blok.subtitle, { unwrap: true })" />

    <SifCmsButton
      v-if="blok.cta && blok.cta[0]"
      slot="primary-cta"
      v-editable="blok.cta[0]"
      class="menu-info-card__cta"
      :blok="blok.cta[0]"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  props: {
    blok: {
      type: Object as PropType<{
        image: any;
        theme?: string;
        icon: string;
        subtitle: string;
        cta: any;
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const { getImageSrc } = useImageResizer();
    const themeClasses = computed(() => blok.theme ? `theme--${blok.theme}` : '');

    return {
      themeClasses,

      getImageSrc,
      renderRichText,
      hasRichText,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .menu-info-card {
    @import '@storefront-ui/shared/styles/_helpers.scss';

    display: grid;
    // grid-template-columns: 3.14rem auto;
    gap: var(--spacer-lg);

    align-items: center;

    padding: var(--spacer-lg) var(--app-gutter);

    color: var(--theme-color, var(--c-text));
    background-color: var(--theme-background, var(--c-light-green));

    @include for-desktop {
      grid-template-columns: auto;
      // grid-template-rows: 6rem auto;

      padding: var(--spacer-lg) var(--spacer-xl);
    }

    &__icon-wrapper {
      display: flex;
      align-items: center;

      svg {
        max-width: 100%;
        height: 100%;
      }
    }

    &__subtitle {
      max-width: 45ch;
      text-align: left;

      @include for-desktop {
        max-width: 20ch;
        font-size: var(--font-size--title-sm);
      }
    }

    &__cta {
      @include for-desktop {
        max-width: 25ch;
      }
    }
  }
}
</style>
