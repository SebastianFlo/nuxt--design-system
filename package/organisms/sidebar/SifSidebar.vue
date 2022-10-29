<template>
  <SfSidebar
    :visible="visible" class="sif-sidebar sf-sidebar--right"
    :class="{
      'sif-sidebar--no-top-bar': !title,
      'sif-sidebar--has-header': $slots.hasOwnProperty('header'),
      'sif-sidebar--has-footer': $slots.hasOwnProperty('footer'),
    }" :style="themeStyles"
    @close="() => $emit('close')">
    <SfBar
      v-if="title"
      slot="bar" :title="title"
      :close="true" @click:close="() => $emit('close')" />

    <header
      slot="content-top"
      class="sif-sidebar__header" :class="headerTheme ? `theme--${headerTheme}` : ''">
      <slot name="header" />
      <SfButton
        v-if="headerClose" class="sf-button--pure sif-sidebar__header-close"
        aria-label="close" type="button"
        @click="$emit('close')">
        <SfIcon
          icon="cross"
          size="25px" />
      </SfButton>
    </header>

    <slot />

    <footer
      slot="content-bottom"
      class="sif-sidebar__footer" :class="footerTheme ? `theme--${footerTheme}` : ''">
      <slot name="footer" />
    </footer>
  </SfSidebar>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { SfBar, SfButton, SfIcon, SfSidebar } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfBar,
    SfButton,
    SfIcon,
    SfSidebar,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    headerClose: {
      type: Boolean,
      default: false,
    },
    headerTheme: {
      type: String,
      default: '',
    },
    footerTheme: {
      type: String,
      default: '',
    },
  },
  setup({ headerTheme, footerTheme }) {
    const themeStyles = computed(() => {
      const [headerBackground, headerColor] = (headerTheme ?? '').split('_');
      const [footerBackground, footerColor] = (footerTheme ?? '').split('_');

      return {
        '--sidebar-header-background': headerBackground ? `var(--c-${headerBackground})` : 'initial',
        '--sidebar-header-color': headerColor ? `var(--c-${headerColor})` : 'initial',
        '--sidebar-footer-background': footerBackground ? `var(--c-${footerBackground})` : 'initial',
        '--sidebar-footer-color': footerColor ? `var(--c-${footerColor})` : 'initial',
      };
    });

    return {
      themeStyles,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-sidebar {
    --sidebar-width: 100%;
    --sidebar-content-font-family: var(--font-family--primary);
    --sidebar-background: var(--c-light);

    // custom prop
    --sidebar-gutter: var(--spacer-lg);

    display: grid;
    flex-direction: column;

    width: 100%;
    z-index: var(--z-index-over-view-1);

    @include for-desktop {
      --sidebar-width: min(30rem, 100%);
    }

    // default overrides
    .sf-bar {
      --bar-padding: 0 var(--sidebar-gutter);
      --bar-background: transparent;
      --bar-height: var(--header-height);
      border-bottom: var(--border-dark);

      // this is needed to left align the bar,
      // since the first child is used to contain a close button in SfSidebar
      > :first-child {
        display: none;
      }

      &__title {
        font-size: var(--font-size--title-sm);
        font-family: var(--font-family--primary);
        line-height: var(--lh--flat);
        text-transform: uppercase;
      }
    }

    &--no-top-bar .sf-bar {
      display: none;
    }

    // default overrides
    .sf-sidebar__aside {
      border: var(--border-dark);
      z-index: var(--z-index-navigation-front);
    }


    .sf-sidebar__top {
      --sidebar-top-padding: var(--spacer-base) var(--sidebar-gutter);
      background-color: var(--sidebar-header-background);
      color: var(--sidebar-header-color, var(--c-text));
      justify-content: center;
      border-bottom: thin solid var(--sidebar-header-color, var(--c-dark-green));
    }

    &:not(.sif-sidebar--has-header) .sf-sidebar__top {
      display: none;
    }

    .sf-sidebar__content {
      --sidebar-content-padding: var(--spacer-sm) var(--sidebar-gutter);
      --sidebar-content-font-family: var(--font-family--primary);
    }

    .sf-sidebar__bottom {
      --sidebar-bottom-padding: var(--spacer-sm) var(--sidebar-gutter) var(--spacer-base);
      background-color: var(--sidebar-footer-background);
      color: var(--sidebar-footer-color);
      border-top: thin solid var(--sidebar-footer-color, var(--c-dark-green));
    }

    &:not(.sif-sidebar--has-footer) .sf-sidebar__bottom {
      display: none;
    }

    .sf-sidebar__circle-icon {
      display: none;
    }

    &__header-close {
      position: absolute;
      right: var(--sidebar-gutter);
      top: var(--spacer-base);
      color: var(--theme-color, var(--c-text));

      .sf-icon {
        --icon-color: var(--theme-color, var(--c-text));
      }
    }

    &__header-subtitle {
      font-size: var(--font-size--body-sm);
      line-height: var(--lh--tight);
      text-transform: uppercase;
    }

    &__header-title {
      font-size: var(--font-size--title-sm);
      line-height: var(--lh--tight);
      text-transform: uppercase;
      margin-bottom: 2.5em;
    }

    // optional full width cta
    &__footer-cta {
      width: 100%;
      border-top: var(--border-base);
      padding-top: var(--spacer-sm);
    }
  }
}
</style>
