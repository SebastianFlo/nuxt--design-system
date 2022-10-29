<template>
  <details
    ref="el"
    class="sif-accordion-item" :open="innerOpen"
    @click="onClick">
    <summary ref="summary">
      <div>{{ header }}
        <div
          class="sif-accordion-item__open"
          v-html="require(`../../base/icons/plus.svg?raw`)" />
        <div
          class="sif-accordion-item__close"
          v-html="require(`../../base/icons/minus.svg?raw`)" />
      </div>
    </summary>
    <div
      ref="content"
      class="sif-accordion-item__content">
      <slot />
    </div>
  </details>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    header: {
      type: String as PropType<string>,
      default: '',
    },
    open: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const el = ref<HTMLElement | null>(null);
    const summary = ref<HTMLElement | null>(null);
    const content = ref<HTMLElement | null>(null);

    const innerOpen = ref(props.open);

    // based on https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
    let animation: Animation | null = null;
    let isClosing = false;
    let isExpanding = false;

    // animation duration and easing defaults,
    // can be overriden in css, where we get values in mounted.
    let animationDuration = 350;
    let animationEasing = 'ease-out';

    // Updates state and resets styles whenever an expand or shrink animation finishes.
    const onAnimationFinish = (value: boolean) => {
      if (!el.value) {
        return;
      }

      // Set the details[open] value to reflect the final state.
      innerOpen.value = value;
      if (value) {
        emit('open');
      }

      // Clear the stored animation
      animation = null;
      // Reset isClosing & isExpanding
      isClosing = false;
      isExpanding = false;

      // Remove the overflow hidden and the fixed height
      el.value.style.height = '';
      el.value.style.overflow = '';
    };

    // Expand animation
    const expand = () => {
      if (!el.value || !summary.value) {
        return;
      }

      // Set the element state as "expanding"
      isExpanding = true;

      const startHeight = el.value.offsetHeight;
      const endHeight = summary.value.offsetHeight + (content.value?.offsetHeight ?? 0);

      // If there is already an animation running, cancel it
      animation?.cancel();

      // Start a WAAPI animation
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
      animation = el.value.animate({
        // Set the start and end keyframes of the animation
        height: [`${startHeight}px`, `${endHeight}px`],
      }, {
        duration: animationDuration,
        easing: animationEasing,
      });

      // When the animation is complete, call onAnimationFinish()
      animation.onfinish = () => onAnimationFinish(true);

      // If the animation is cancelled, reset the state
      animation.oncancel = () => {
        isExpanding = false;
      };
    };

    const shrink = () => {
      if (!el.value || !summary.value) {
        return;
      }

      const startHeight = el.value.offsetHeight ?? 0;
      const endHeight = summary.value.offsetHeight ?? 0;

      if (animation) {
        animation.cancel();
      }

      // Start a WAAPI animation
      animation = el.value?.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [`${startHeight}px`, `${endHeight}px`],
      }, {
        duration: animationDuration,
        easing: animationEasing,
      });

      // When the animation is complete, call onAnimationFinish()
      animation.onfinish = () => onAnimationFinish(false);
      // If the animation is cancelled, isClosing variable is set to false
      animation.oncancel = () => {
        isClosing = false;
      };
    };

    const open = () => {
      if (!el.value) {
        return;
      }

      // Apply a fixed height on the element
      el.value.style.height = `${el.value.offsetHeight}px`;
      // Force the [open] attribute on the details element
      innerOpen.value = true;
      emit('open');

      // Wait for the next frame to call the expand function
      window.requestAnimationFrame(expand);
    };

    const toggle = () => {
      if (!el.value) {
        return;
      }

      // Add an overflow on the <details> to avoid content overflowing
      el.value.style.overflow = 'hidden';

      // Check if the element is being closed or is already closed
      if (isClosing || !innerOpen.value) {
        open();
        // Check if the element is being openned or is already open
      } else if (isExpanding || innerOpen.value) {
        shrink();
      }
    };

    const onClick = (event: Event) => {
      // Stop default behaviour from the browser
      event.preventDefault();
      if (!el.value) {
        return;
      }

      toggle();
    };

    // react to any outside changes to open prop,
    // and animate accordingly
    watch(() => props.open, (value) => {
      if (!el.value) {
        innerOpen.value = value;
        return;
      }

      if (innerOpen.value !== value) {
        toggle();
      }
    }, { immediate: true });

    onMounted(() => {
      if (el.value) {
        const computedStyle = window.getComputedStyle(el.value);
        const rawDuration = computedStyle.getPropertyValue('--accordion-item-animation-duration');

        animationDuration = getAnimationDurationMs(rawDuration);
        animationEasing = computedStyle.getPropertyValue('--accordion-item-animation-easing');;
      }
    });

    return {
      // refs
      el,
      summary,
      content,

      // data
      innerOpen,

      // methods
      onClick,
    };
  },
});


// Extracts the animation duration from a css string.
// ex: .4s OR 300ms
function getAnimationDurationMs(rawValue: string) {
  const [match, value, unit] = rawValue.match(/([\d\.]+)(s|ms)/) ?? [];

  if (!match) {
    return 0;
  }

  const valueFloat = parseFloat(value);
  if (isNaN(valueFloat)) {
    return 0;
  }

  switch (unit) {
    case 's': return valueFloat * 1000;
    default: return valueFloat;
  }
}
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';
$sif-icon-path: '../../base/icons';

.sif-ds {
  .sif-accordion-item {
    // Animation duration and easing for the js animation,
    // (get on mounted)
    --accordion-item-animation-duration: .35s;
    --accordion-item-animation-easing: var(--ease-2);
    --accordion-item-side-padding: 0;
    --accordion-item-header-padding: var(--spacer-base) var(--accordion-item-side-padding);
    --accordion-item-content-padding: var(--spacer-lg) var(--accordion-item-side-padding);

    border-top: 1px solid var(--theme-color, var(--c-dark));

    &--small {
      --accordion-item-header-padding: var(--spacer-xs) var(--accordion-item-side-padding);
      --accordion-item-content-padding: var(--spacer-sm) var(--accordion-item-side-padding);
    }

    &:not(:first-child) {
      border-top: 1px solid var(--theme-color, var(--c-dark));
    }

    summary {
      padding: var(--accordion-item-header-padding);
      list-style: none;

      font-size: var(--font-size--title-sm);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
      line-height: var(--lh--tight);

      outline: none;

      cursor: pointer;
    }

    summary>div {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
    }

    summary::-webkit-details-marker {
      display: none
    }

    &__open,
    &__close {
      flex-shrink: 0;

      display: flex;
      justify-content: center;
      align-items: center;
      width: max(30px, min(calc(40 / 1440 * 100vw), 50px));
      height: max(30px, min(calc(40 / 1440 * 100vw), 50px));

      color: var(--theme-color, var(--c-dark));
    }

    &[open] .sif-accordion-item__open,
    &:not([open]) .sif-accordion-item__close {
      display: none;
    }

    &__content {
      padding: var(--accordion-item-content-padding);
    }
  }
}
</style>
