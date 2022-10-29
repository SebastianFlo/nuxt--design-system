<template>
  <div class="sif-meal-details-nav">
    <div
      v-if="prevImage && prevImage.filename" class="sif-meal-details-nav__prev"
      @click.stop="() => navigate(index - 1)">
      <img
        :src="getImageSrc(prevImage.filename)"
        :alt="prevImage.alt" />
      <div class="sif-meal-details-nav__label">
        <SfCircleIcon icon="arrow_left" />
        <span>{{ mealLabel + ' ' + index }}</span>
      </div>
    </div>
    <div v-else />
    <div
      v-if="nextImage && nextImage.filename" class="sif-meal-details-nav__next"
      @click.stop="() => navigate(index + 1)">
      <img :src="getImageSrc(nextImage.filename)" />
      <div class="sif-meal-details-nav__label">
        <span>{{ mealLabel + ' ' + (index + 2) }}</span>
        <SfCircleIcon icon="arrow_right" />
      </div>
    </div>
    <div v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfCircleIcon } from '@storefront-ui/vue';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfCircleIcon,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    prevImage: {
      type: Object as PropType<{ filename: string, description: string } | null>,
      default: null,
    },
    nextImage: {
      type: Object as PropType<{ filename: string, description: string } | null>,
      default: null,
    },
    mealLabel: {
      type: String,
      default: 'meal',
    },
  },
  setup(_, { emit }) {
    const { getImageSrc } = useImageResizer();

    const navigate = (index: number) => emit('navigate', index);

    return {
      getImageSrc,
      navigate,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sif-meal-details-nav {
    display: flex;
    flex-wrap: nowrap;
    color: var(--c-light-lighten);

    >div {
      width: 50%;
      display: grid;
      align-items: center;
      justify-items: center;

      >* {
        grid-column: -1/1;
        grid-row: -1/1;
      }

      &::before {
        content: "";
        grid-column: -1/1;
        grid-row: -1/1;
        width: 100%;
        height: 100%;
        background: var(--c-black);
        opacity: 0.4;
        z-index: var(--z-index-content-front);
      }
    }

    &__label {
      display: flex;
      align-items: center;
      font-size: var(--font-size--body-sm);
      font-style: italic;
      text-transform: uppercase;
      font-weight: var(--font-weight--bold);
      z-index: var(--z-index-content-front);

      >*+* {
        margin-left: var(--spacer-xs);
      }
    }

    .sf-circle-icon {
      --button-background: var(--c-light-lighten);
      --button-border: none;
      --button-hover-background: var(--c-light-lighten);
      --icon-color: var(--c-text);

      --button-size: max(35px, min(6vw, 80px));
      --icon-size: calc(var(--button-size) * 0.45);
      --button-border-radius: 50%;
    }
  }
}
</style>
