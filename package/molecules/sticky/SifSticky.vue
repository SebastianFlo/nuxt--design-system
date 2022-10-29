<template>
  <div
    ref="container" class="[ sticky ]"
    :class="{
      'sticky--stuck': isStuck,
      'sticky--top': position === 'top',
      'sticky--bottom': position === 'bottom',
      'sticky--animate-in': animationState === 'animate-in',
      'sticky--animate-out': animationState === 'animate-out',
    }" :style="{
      height: isStuck && stuckHeight ? `${stuckHeight}px` : '',
    }">
    <div
      ref="inner"
      class="[ sticky__inner ]" @animationend="onAnimationEnd">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from '@nuxtjs/composition-api';
import { useIntersectionObserver } from '../../base/hooks/use-intersection-observer';
import { useWindowScroll } from '../../base/hooks/use-window-scroll';

export default defineComponent({
  props: {
    /*
     * Controls where to position the sticky element on the screen when stuck.
      This is not just styling, as it has some underlying logical implications.
     */
    position: {
      type: String,
      default: 'top',
    },
    /*
     * Configuration option for the underlying intersection observer.
     * Useful if you want finegrained control over when the sticky component pops up
     * from the page.
     */
    threshold: {
      type: Number,
      default: 0,
    },
    /*
     * Configuration option for the underlying intersection observer.
     * Useful if you want finegrained control over when the sticky component pops up
     * from the page.
     */
    rootMargin: {
      type: String,
      default: '',
    },
    /*
     * Use this for the "classic" behavior of only sticking a menu when the user
     * scrolls up the page again.
     */
    scrollBehavior: {
      type: String as PropType<'hide-on-down'>,
      default: '',
    },
    stickBehavior: {
      type: String as PropType<'stick-when-above' | 'stick-when-below'>,
      default: 'stick-when-below',
    },
  },

  setup({ scrollBehavior, stickBehavior, threshold, rootMargin, position }, { emit }) {
    const container = ref<Element | null>(null);
    const inner = ref<Element | null>(null);
    const stuckHeight = ref<number | null>(null);
    const animationState = ref<'animate-in' | 'animate-out' | null>(null);
    const isStuck = ref(false);

    const {
      isViewBelowElement,
      isViewAboveElement,
      isElementInView,
    } = useIntersectionObserver(container, {
      threshold,
      rootMargin: rootMargin || undefined,
    });

    const { direction: scrollDirection } = useWindowScroll({ throttle: 5 });

    // This is the core state we use to stick/unstick the elements
    const shouldStick = computed(() => {
      // If we want to hide the sticky element on scroll down,
      // unstick it unless the direction is up.
      if (scrollBehavior === 'hide-on-down' && scrollDirection.value === 'down') {
        return false;
      }

      if (stickBehavior === 'stick-when-below') {
        // If we are below, we stick
        if (isViewBelowElement.value) {
          return true;
        }

        // If we are above, we don't stick
        if (isViewAboveElement.value) {
          return false;
        }

        // If we are in the viewport, sticky depends on the desired position.
        if (position === 'bottom') {
          return isElementInView.value;
        } else {
          return false;
        }
      }

      if (stickBehavior === 'stick-when-above') {
        // If we are above, we stick
        if (isViewAboveElement.value) {
          return true;
        }

        // If we are below, we don't stick
        if (isViewBelowElement.value) {
          return false;
        }

        // If we are in the viewport, sticky depends on the desired position.
        if (position === 'top') {
          return isElementInView.value;
        } else {
          return false;
        }
      }

      // We should never reach this point, this is in here for type completeness.
      return true;
    });

    // Sets the stuck height, so we reserve some space for when it unsticks again
    const updateStuckHeight = () => {
      stuckHeight.value = inner.value?.getBoundingClientRect().height ?? 0;
    };

    const addResizeListener = () => {
      window.addEventListener('resize', updateStuckHeight);
    };

    const removeResizeListener = () => {
      window.removeEventListener('resize', updateStuckHeight);
    };

    onMounted(() => {
      updateStuckHeight();
      addResizeListener();

      isStuck.value = shouldStick.value;

      watch(shouldStick, (value) => {
        // only animate when doing "hide-on-down", otherwise just keep the values in sync.
        if (scrollBehavior !== 'hide-on-down') {
          isStuck.value = value;
          return;
        }

        // don't animate when the element comes into view, just unstick it.
        if (isElementInView.value) {
          animationState.value = null;
          isStuck.value = false;
          return;
        }

        // when sticking, sync the values up front, so we can animate based on the stuck position.
        if (value) {
          isStuck.value = true;
        }

        // set the animation state to start the animation,
        // then sync the isStuck after animation finishes.
        animationState.value = value ? 'animate-in' : 'animate-out';
      });

      watch(isStuck, (value) => {
        emit('stuck-changed', value);

        if (value) {
          updateStuckHeight();
        }
      });
    });

    const onAnimationEnd = () => {
      animationState.value = null;
      isStuck.value = shouldStick.value;
    };

    onUnmounted(removeResizeListener);

    return {
      // element refs
      container,
      inner,

      // data
      isStuck,
      animationState,
      stuckHeight,
      scrollDirection,

      // events
      onAnimationEnd,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sticky {
    --sticky-top: auto;
    --sticky-bottom: auto;
    --sticky-animation: none;
    --sticky-animation-duration: .4s;
    --sticky-transform-origin: center center;
    width: inherit;

    &__inner {
      width: inherit;
      transform-origin: var(--sticky-transform-origin);
      z-index: var(--z-index-content-front);
      top: var(--sticky-top);
      bottom: var(--sticky-bottom);
      left: 0;
      animation: var(--sticky-animation);
    }

    &.sticky--stuck {
      .sticky__inner {
        position: fixed;
        pointer-events: none;

        >* {
          pointer-events: all;
        }
      }
    }

    &.sticky--top {
      --sticky-top: 0;
      --sticky-transform-origin: top center;

      &.sticky--animate-in {
        --sticky-animation: var(--animation-slide-in-down);
      }

      &.sticky--animate-out {
        --sticky-animation: var(--animation-slide-out-up);
      }
    }


    &.sticky--bottom {
      --sticky-bottom: 0;
      --sticky-transform-origin: bottom center;

      &.sticky--animate-in {
        --sticky-animation: var(--animation-slide-in-up);
      }

      &.sticky--animate-out {
        --sticky-animation: var(--animation-slide-out-down);
      }
    }
  }
}
</style>
