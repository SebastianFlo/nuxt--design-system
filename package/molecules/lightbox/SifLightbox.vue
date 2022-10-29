<template>
  <aside
    class="sif-lightbox"
    :class="theme" @click="close">
    <SfOverlay :visible="isOpen" />
    <div
      v-if="isOpen"
      ref="container" class="sif-lightbox__container">
      <div
        ref="inner"
        class="sif-lightbox__inner" @click.stop="closeIfOutsideInner">
        <slot />
      </div>

      <SfCircleIcon
        v-if="!isScrollAtStart" class="sif-lightbox__arrow-prev"
        icon="arrow_left"
        :aria-label="previousLabel" @click.stop="goBack" />
      <SfCircleIcon
        v-if="!isScrollAtEnd && (index < (nbOfItems - 1))" class="sif-lightbox__arrow-next"
        icon="arrow_right" :aria-label="nextLabel"
        @click.stop="goForward" />
      <SfButton
        class="sf-button--pure sif-lightbox__close"
        aria-label="close" type="button"
        @click="close">
        <SfIcon icon="cross" />
      </SfButton>
    </div>
  </aside>
</template>

<script lang="ts">
import { SfButton, SfCircleIcon, SfIcon, SfOverlay } from '@storefront-ui/vue';
import { clickOutside } from '@storefront-ui/vue/src/utilities/directives/click-outside/click-outside-directive';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { computed, defineComponent, onMounted, ref, nextTick, watch } from '@nuxtjs/composition-api';
import { useScrollControls } from '../../base/hooks/scroll/use-scroll-controls';

export default defineComponent({
  components: {
    SfButton,
    SfCircleIcon,
    SfIcon,
    SfOverlay,
  },
  directives: { clickOutside },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    nbOfItems: {
      type: Number,
      default: 1,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    previousLabel: {
      type: String,
      default: 'previous',
    },
    nextLabel: {
      type: String,
      default: 'next',
    },
  },
  setup(props, { emit, attrs }) {
    const container = ref<Element | null>(null);
    const inner = ref<Element | null>(null);
    const theme = computed(() => {
      if (/theme\-/.test(attrs.class as string)) {
        return '';
      }

      return 'theme--blue_creme';
    });

    const {
      scrollIndex,
      isScrollAtStart,
      isScrollAtEnd,
      goTo,
      goBack,
      goForward,
    } = useScrollControls(inner, { index: props.index });

    onMounted(() => {
      // TODO: add keyboard navigation
      watch(() => props.isOpen, isOpen => {
        if (!process.client) {
          return;
        }

        if (isOpen) {
          nextTick(() => {
            scrollIndex.value = props.index;
            const el = inner.value;
            disableBodyScroll(el);

            // iOS specific fix:
            // Body scroll lock needs to lock both parent and children,
            // otherwise children will not be scrollable.
            //
            // This is not ideal, and we should consider if scroll lock is
            // even needed.
            for (const child of Array.from(el?.children ?? [])) {
              disableBodyScroll(child);
            }
          });
        } else {
          clearAllBodyScrollLocks();
        }
      }, { immediate: true });
    });


    const close = () => {
      emit('close');
    };

    const closeIfOutsideInner = (event: Event) => {
      const target = event.target as Element;

      // If the click target is outside the inner element,
      // close the lightbox.
      if (inner.value === target || !(inner.value?.contains(target))) {
        close();
      }
    };

    onMounted(() => {
      watch(() => [props.index, props.isOpen], (values, prevValues) => {
        if (!values[1] || (prevValues && values[0] === prevValues[0])) {
          return;
        }

        goTo(values[0] as number, { behavior: 'instant' });
      }, { immediate: true });

      watch(scrollIndex, (value) => {
        emit('navigate', value);
      });
    });

    return {
      container,
      inner,
      isScrollAtStart,
      isScrollAtEnd,
      theme,

      goBack,
      goForward,
      close,
      closeIfOutsideInner,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sif-lightbox {
    --lightbox-width: max(75vw, 675px);
    --lightbox-max-height: max(80vh, 960px);
    --lightbox-side-gutter: calc((100vw - var(--lightbox-width)) / 2);

    --lightbox-top-gutter: calc((100vh - var(--lightbox-height)) / 2);

    --lightbox-arrow-position: fixed;
    --lightbox-arrow-top: calc(50vh - var(--spacer-xs));
    --lightbox-arrow-distance: max(var(--spacer-xl), calc((100vw - var(--lightbox-width)) / 4));

    --lightbox-height: max(960px, 80vh);

    --lightbox-close-top: var(--spacer-base);
    --lightbox-close-right: var(--app-gutter);
    --lightbox-arrow-display: flex;

    --lightbox-align: center;

    display: flex;
    flex-direction: column;
    z-index: var(--z-index-modal-1);

    &__container {
      position: fixed;
      display: flex;
      justify-content: center;
      top: var(--lightbox-top-gutter);
      top: max(var(--lightbox-top-gutter), env(safe-area-inset-top, 0));

      left: var(--lightbox-side-gutter);

      bottom: var(--lightbox-top-gutter);
      bottom: max(var(--lightbox-top-gutter), env(safe-area-inset-bottom, 0));

      width: var(--lightbox-width);
      max-width: 100vw;

      max-height: var(--lightbox-max-height);

      z-index: var(--z-index-modal-1);
    }

    &__inner {
      height: 100%;

      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 100%;
      grid-template-rows: 100%;
      align-items: var(--lightbox-align);
      align-content: center;

      overflow-x: auto;
      scroll-snap-type: x mandatory;

      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }

      -ms-overflow-style: none;
      scrollbar-width: none;
      /* Firefox */

      >* {
        scroll-snap-align: center;
        max-height: 100%;
        // defaulting the "--vh" to 8, to give a 800px fallback in design system.
        max-height: min(100%, calc(100px * var(--vh, 8)));
        overflow-y: scroll;
      }

      >img,
      >picture,
      >.sf-image,
      >video {
        width: 100%;
        object-fit: contain;
      }
    }

    &__arrow-prev.sf-button,
    &__arrow-next.sf-button {
      --button-background: var(--theme-background, var(--c-light-lighten));
      --button-border: none;
      --icon-color: var(--theme-color, var(--c-text));

      --button-size: max(35px, min(6vw, 80px));
      --icon-size: calc(var(--button-size) * 0.45);
      --button-border-radius: 50%;

      display: var(--lightbox-arrow-display);
      position: var(--lightbox-arrow-position);
      top: var(--lightbox-arrow-top);
      z-index: var(--z-index-modal-1);

      &:hover,
      &:active {
        --button-background: var(--theme-color, var(--c-text));
        --icon-color: var(--theme-background, var(--c-light-lighten));
      }
    }

    &__arrow-prev.sf-button {
      left: var(--lightbox-arrow-distance);
      transform: translate(-50%, -50%);
    }

    &__arrow-next.sf-button {
      right: var(--lightbox-arrow-distance);
      transform: translate(50%, -50%);
    }

    &__close.sf-button {
      --button-hover-background: white;
      --button-hover-border-color: var(--c-text);
      --button-hover-color: var(--c-text);
      --button-width: max(35px, min(6vw, 50px));
      --button-height: max(35px, min(6vw, 50px));
      --button-padding: 0;
      --button-background: white;
      --button-border: none;
      border-radius: 50%;

      position: absolute;
      top: var(--lightbox-close-top);
      right: var(--lightbox-close-right);
      bottom: var(--lightbox-close-bottom, auto);
      left: var(--lightbox-close-left, auto);
      border-radius: 50%;

      box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.1);

      color: var(--theme-color, var(--c-text));

      .sf-icon {
        --icon-color: var(--theme-color, var(--c-text));
        --icon-size: 57%;
        --icon-color: var(--c-text);
      }
    }
  }
}
</style>
