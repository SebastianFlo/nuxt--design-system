<template>
  <footer
    v-if="!isWebView"
    id="footer" ref="container"
    class="[ sif-footer ]">
    <section
      v-if="blok.navigationGroups && blok.navigationGroups.length"
      class="[ sif-footer__links ]">
      <div
        v-for="group in blok.navigationGroups"
        :key="group.uuid" v-editable="group">
        <h3>{{ group.name }}</h3>
        <ul>
          <li
            v-for="item of group.items"
            :key="item.uuid">
            <SifCmsLink
              v-if="item.component === 'link'"
              v-editable="item" :blok="item">
              {{ item.name }}
            </SifCmsLink>
            <SifCmsRegionSwitcher
              v-if="item.component === 'region-switcher'"
              v-editable="item" :blok="item" />
          </li>
        </ul>
      </div>
      <div class="[ sif-footer__links-external ]">
        <div class="[ sif-footer__some-links ]">
          <component
            :is="getLinkComponentType(item.link)" v-bind="getLinkProps(item.link)"
            v-for="item in blok.socialMediaLinks" :key="item._uid"
            v-editable="item" class="sf-link">
            <img
              v-if="item.icon"
              :src="item.icon.filename" :alt="item.name" />
            <span>{{ item.name }}</span>
          </component>
        </div>
        <div class="[ sif-footer__badges ]">
          <component
            :is="getLinkComponentType(badge.link)" v-for="badge in blok.badges"
            :key="badge._uid"
            v-bind="getLinkProps(badge.link)" class="[ sif-footer__badge ]">
            <img
              v-if="badge.icon"
              :src="badge.icon.filename" :alt="badge.icon.alt"
              width="50" />
          </component>
        </div>
      </div>
    </section>

    <section class="[ sif-footer__payment ]">
      <img
        v-for="card in blok.paymentCards"
        :key="card" :src="require('../../base/icons/' + card + '.svg')" />
    </section>
    <section class="[ sif-footer__info ]">
      <div
        class="[ sif-footer__copyright ]"
        v-html="renderRichText($storyapi, blok.companyInfo)" />
    </section>
  </footer>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsButton from '../../atoms/button/SifCmsButton.vue';
import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';
import SifCmsInput from '../../atoms/input/SifCmsInput.vue';
import SifCmsLink from '../../atoms/link/SifCmsLink.vue';
import SifCmsRegionSwitcher from '../../molecules/region-switcher/RegionSwitcher.vue';
import { getLinkComponentType, getLinkProps, Link } from '../../base/helpers/storyblok-component.helpers';

interface Footer {
  signupCampaign: string;
  emailHeadline: any;
  emailDescription: any;
  emailSignup: any[];
  navigationGroups: any[];
  companyInfo: any[];
  paymentInfo: any;
  socialMediaLinks: any[];
  badges: any[];
  regionSwitcher: any[];
  paymentCards: any[];
  badgeLink: Link;
}

export default defineComponent({
  components: {
    SifCmsButton,
    SifCmsHeading,
    SifCmsInput,
    SifCmsLink,
    SifCmsRegionSwitcher,
  },
  props: {
    blok: {
      type: Object as PropType<Footer>,
      required: true,
    },
  },
  setup({ blok }) {
    const container = ref<Element | null>(null);
    return {
      // refs
      container,


      // helpers
      getLinkComponentType,
      getLinkProps,
      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-footer {
    display: grid;

    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto) 1fr;
    grid-template-areas:
      "email"
      "links"
      "payment"
      "info";

    width: 100%;
    // extract
    background: var(--c-light);

    font-size: var(--font-size--body-sm);

    @include for-desktop {
      grid-template-columns: minmax(30%, auto) 1fr;
      grid-template-rows: auto min-content;
      grid-template-areas:
        "email    links"
        "payment  info";

      font-size: var(--font-size--body-xs);
    }

    >* {
      padding: var(--spacer-lg) var(--app-gutter);
      border-top: var(--border-dark);
    }

    &__email {
      grid-area: email;

      display: grid;
      grid-gap: var(--spacer-sm);
      align-content: flex-start;

      p {
        max-width: 60ch;
      }

      .sf-heading__title.h1,
      .sf-heading__title.h2,
      .sf-heading__title.h3,
      .sf-heading__title.h4 {
        line-height: var(--lh--flat);
      }

      // email form
      form {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      // I don't like this input,
      // the error message is borderline unreadable,
      // and the input in general does not work well in smaller height.
      .sf-input {
        --input-height: 2.875rem;
        flex-grow: 1;
        outline: none;
        border: var(--border-dark);

        &__error-message {
          padding-bottom: .25em;
        }
      }

      // TODO: extract into new input+button combo molecule
      // (except the sizes)
      .sf-button {
        flex-shrink: 0;
        display: flex;
        min-width: 7.43rem;
        height: 100%;
        padding: 0.7rem 2rem;

        border: var(--border-dark);
        border-left: none;

        font-family: var(--font-family--primary);
        font-size: var(--font-size--body-sm);
        text-transform: uppercase;
        font-style: italic;
        font-weight: 700;

        // Theme overwrites:
        --theme-color: var(--c-dark-green);
        --theme-background: var(--c-neon);
        --button-hover-background: var(--c-neon);
        // No rounded corners:
        --button-border-radius: 0;
      }
    }

    &__links {
      grid-area: links;

      display: grid;
      // TODO: test that this works with fluid base font size
      grid-template-columns: repeat(2, 1fr);
      grid-row-gap: var(--spacer-xl);
      align-content: stretch;

      @include for-desktop {
        grid-template-columns: repeat(4, 1fr);
        border-left: var(--border-dark);
      }

      >* {
        grid-column: span 1;
      }

      h3 {
        font-size: var(--font-size--body-sm);
        font-weight: 700;
        font-style: italic;
        text-transform: uppercase;
        line-height: var(--lh--flat);

        // almost two lines of spacing... :)
        margin-bottom: 1.8em;

        @include for-desktop {
          font-size: var(--font-size--body-xs);
        }
      }

      ul,
      li {
        display: block;
        padding: 0;
      }

      ul {
        margin: 0;
      }

      .sf-link {
        font-size: var(--font-size--body-xl);
        line-height: var(--lh--loose);
        --link-text-decoration: none;

        &:hover {
          --link-color: var(--c-clay-darken); // a bit controversial (Jane finds the neon color unreadable)...
        }

        @include for-desktop {
          font-size: var(--font-size--body-base);
        }
      }

      li {
        margin: 0;
        list-style-type: none;
      }

      // External links, like SOME, B-Corp and eco badges.
      &-external {
        grid-column: -1/1; // single row, to hold icon-links.

        display: flex;
        justify-content: space-between;

        >* {
          align-items: end;
          justify-content: end;
        }
      }
    }

    .sif-region-switcher {
      --region-switcher-font-size: var(--font-size--body-xl);

      @include for-desktop {
        --region-switcher-font-size: var(--font-size--body-base);
      }
    }

    &__payment,
    &__info {
      padding-top: var(--spacer-sm);
      padding-bottom: var(--spacer-sm);

      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--spacer-xs);

      @include for-desktop {
        border-top: var(--border-dark);

        justify-content: left;
      }
    }

    &__payment {
      grid-area: payment;
    }

    &__info {
      grid-area: info;

      @include for-desktop {
        justify-content: right;
      }
    }

    &__copyright {
      flex-shrink: 0;
    }

    &__some-links {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: var(--spacer-sm);

      @include for-desktop {
        flex-direction: row;
      }

      .sf-link {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: var(--font-size--body-lg);

        @include for-desktop {
          font-size: var(--font-size--body-sm);
        }

        img {
          margin-right: 1ch;
        }
      }
    }

    &__badges {
      display: flex;
      gap: var(--spacer-sm);

      img {
        max-width: 60px;
        max-height: 100px;

        @include for-desktop {
          max-width: 50px;
          max-height: 80px;
        }
      }
    }
  }
}
</style>
