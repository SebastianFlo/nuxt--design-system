<template>
  <section
    ref="element"
    class="sticky-cta">
    <SifCmsButton
      v-if="blok.button && blok.button[0]"
      v-editable="blok.button[0]" :blok="blok.button[0]" />
    <transition name="sticky-container--fade">
      <div
        v-if="isStuck"
        class="sticky-container" :class="blok.stuckTheme && `theme--${blok.stuckTheme}`">
        <SifCmsButton
          v-if="blok.button && blok.button[0]"
          v-editable="blok.button[0]" :blok="blok.button[0]" />
        <div v-html="renderRichText($storyapi, blok.text)" />
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsButton from '../../atoms/button/SifCmsButton.vue';
import { useIntersectionObserver } from '../../base/hooks/use-intersection-observer';

export default defineComponent({
  components: {
    SifCmsButton,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const element = ref<Element | null>(null);
    const footer = ref<Element | null>(null);

    const { isViewBelowElement } = useIntersectionObserver(element);
    const { isElementInView: isFooterInView } = useIntersectionObserver(footer);

    const isStuck = computed(() =>
      isViewBelowElement.value && !isFooterInView.value,
    );

    onMounted(() => {
      footer.value = document.getElementById('footer');
    });

    return {
      element,
      isStuck,
    };
  },
  methods: {
    hasRichText,
    renderRichText,
    toggleChat(isStuck: boolean) {
      if (window.zE) {
        if (isStuck) {
          window.zE('webWidget', 'hide');
        } else {
          window.zE('webWidget', 'show');
        }
      }
    },
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sticky-cta {
    .sticky-container {
      display: flex;

      justify-content: center;
      align-items: center;

      width: 100%;
      position: fixed;
      left: 50%;
      bottom: 0;

      // Good ol absolute/fixed + transform centering.
      // Note: could have used full width and flex, but would risk to
      // then have the content under the container be unclickable.
      transform: translateX(-50%);

      max-width: min(27rem, calc(100vw - (2 * var(--spacer-sm))));

      @include for-desktop {
        max-width: min(23.438rem, calc(100vw - (2 * var(--spacer-sm))));
      }

      margin-bottom: var(--spacer-sm);
      padding: var(--spacer-xs);
      z-index: var(--z-index-navigation-front);
      background: var(--c-light-lighten);
      border: var(--border-dark);

      // TODO: extract
      box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);

      font-size: var(--font-size--body-sm);

      transform-origin: center bottom;

      .sf-button {
        margin-right: var(--spacer-sm);
      }

      >div {
        flex-grow: 1;
      }
    }
  }
}
</style>
