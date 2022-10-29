<template>
  <div
    class="sif-steps"
    :active="active">
    <div
      v-for="(step, index) in steps" :key="index"
      class="sif-steps__step" :class="{
        current: active === index
      }">
      <SfLink
        v-if="canNavigate(index) && step.link"
        :link="step.link" v-html="step.text" />
      <span
        v-else
        :key="index" v-html="step.text" />
    </div>
    <div
      class="sif-steps__progress"
      :style="progressStyles" />
  </div>
</template>

<script lang="ts">
import { SfLink } from '@storefront-ui/vue';
import { RawLocation } from 'vue-router';
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';

export default defineComponent({
  components: {
    SfLink,
  },
  props: {
    steps: {
      type: Array as PropType<{ link: RawLocation, text: string }[]>,
      required: true,
    },
    canGoForward: {
      type: Boolean,
      default: false,
    },
    canGoBack: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const progressStyles = computed(() => ({
      '--steps-progress-width': `${100 / props.steps.length}%`,
      '--steps-progress-active-step': props.active + 1,
    }));

    // Check to see if a step should can navigate
    const canNavigate = (index: number) => {
      // should always be allowed to navigate to current step
      if (index === props.active) {
        return true;
      }

      // can't navigate forward if not allowed.
      if (props.canGoForward !== true && index > props.active) {
        return false;
      }

      // can't navigate backward if not allowed.
      if (props.canGoBack !== true && index < props.active) {
        return false;
      }

      return true;
    };

    return {
      progressStyles,

      canNavigate,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-steps {
    --steps-border-color: var(--c-light-darken);
    --steps-font-size: var(--font-size--body-2xs);
    --steps-counter-size: var(--font-size--body-lg);

    counter-reset: step;
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;
    border-bottom: var(--border-base);

    @include for-desktop {
      --steps-counter-size: var(--font-size--body-base);
      --steps-font-size: var(--font-size--body-base);
    }

    // need that sweet specificity
    &__step {
      --steps-step-after-background: var(--steps-border-color);

      flex-basis: 0;
      flex-grow: 1;
      font-size: var(--steps-font-size);
      line-height: var(--lh--tighter);
      font-family: var(--font-family--primary);

      display: flex;
      flex-wrap: wrap;
      position: relative;
      text-align: left;
      justify-content: center;

      text-transform: uppercase;
      padding: .66em 1ch;

      color: var(--steps-step-color, var(--c-text));

      &.current {
        font-weight: var(--font-weight--bold);
        font-style: italic;
        --steps-step-after-background: var(--c-text);

        >* {
          --link-font-weight: var(--font-weight--bold);
          font-style: italic;
        }
      }

      >*::before {
        counter-increment: step;
        content: counter(step) ". ";
        display: block;
        width: 100%;
        text-align: left;
        font-size: var(--steps-counter-size);
        line-height: var(--lh--loose);

        @include for-desktop {
          display: inline;
          font-size: var(--font-size--body-base);
        }
      }

      &::after {
        content: "";
        position: absolute;
        display: block;
        border-radius: 0;
        bottom: -3px;
        left: 50%;
        width: 1px;
        height: 5px;
        background: var(--steps-step-after-background, transparent);
      }
    }

    .sf-link {
      --link-font-size: var(--steps-font-size);
      --link-font-line-height: var(--lh--tighter);
      --link-font-family: var(--font-family--primary);
      --link-color: var(--c-text);
      --link-text-decoration: none;
    }

    &__progress {
      position: absolute;
      left: 0;
      bottom: var(--steps-progress-bottom, -1px);
      display: block;
      width: var(--steps-progress-width, 0);
      height: 1px;
      background: var(--c-text);

      transform: var(--steps-progress-transform,
          scale3d(calc(-0.5 + var(--steps-progress-active-step, 0)), 1, 1));
      transform-origin: 0 50%;
      transition: transform 150ms ease-in-out;
    }
  }
}
</style>
