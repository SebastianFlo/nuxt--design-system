<template>
  <component
    :is="linkTag"
    class="[ sif-product-card ]" v-bind="linkData">
    <div
      class="[ sif-product-card__media ]"
      @click="() => $emit('click:media')">
      <!-- TODO: set sizes and breakpoints from outside consumer -->
      <picture>
        <source
          :srcset="getImageSrcSet(image, {
            breakpoints: [
              { breakpoint: 0, width: 460 },
              { breakpoint: 1440, width: 640 }
            ],
            format: 'webp',
          })" type="image/webp"
          sizes="(min-width: 1024px) 33vw, 100vw">
        <img
          :src="getImageSrc(image, { width: 460 })"
          :alt="image.alt" loading="lazy"
          width="451" height="338">
      </picture>
    </div>
    <!-- TODO: Currently there are not tags available on Essentials products... -->
    <!-- TODO: Wrap with sif-tooltip class -->
    <!--
    <div class="[ sif-product-card__tags ]">
      <SifTag
        v-for="tag in tags"
        :key="tag.id"
        :icon="tag.image"
        :name="tag.title || ''"
      />
    </div>
    -->
    <div
      class="[ sif-product-card__content ]"
      :class="{ 'view-only': viewOnly }">
      <h3>{{ name }}

        <span v-if="viewOnly">
          ({{ quantity }})
        </span>
      </h3>
      <p>
        {{ description }}
      </p>
      <div v-if="!viewOnly && energy.label && energy.value">
        {{ energy.label }}&nbsp;<b>{{ energy.value }}</b>
      </div>
    </div>
    <div
      class="[ sif-product-card__actions ]">
      <!-- <SifPrice
        :regular="price"
        :currency="currency" /> -->

      <SifCmsMembershipPrice
        v-if="!viewOnly"
        :currency="currency"
        :nonmember-price="price"
        :member-price="price"
      />
      <SfButton
        v-if="cta.length && !viewOnly"
        @click.prevent="addToCart">
        {{ cta }}
      </SfButton>
    </div>
  </component>
</template>

<script lang="ts">
import { RawLocation } from 'vue-router';
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfCircleIcon, SfImage, SfButton } from '@storefront-ui/vue';

import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

import SifPrice from '../../atoms/price/SifPrice.vue';
import SifCmsMembershipPrice from '../../atoms/price/SifCmsMembershipPrice.vue';
import SifTag from '../../atoms/tag/SifTag.vue';

export default defineComponent({
  components: {
    SfCircleIcon,
    SfImage,
    SifPrice,
    SfButton,
    SifTag,
    SifCmsMembershipPrice,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number as PropType<number>,
      required: true,
    },
    quantity: {
      type: Number as PropType<number>,
      default: 1,
    },
    currency: {
      type: String as PropType<string>,
      required: true,
    },
    image: {
      type: Object as PropType<{ filename: string, description: string }>,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    energy: {
      type: Object as PropType<{
        label: string,
        value: number,
      }>,
      required: true,
    },
    energyLabel: {
      type: Number,
      default: 0,
    },
    link: {
      type: [Object, String] as PropType<RawLocation>,
      required: true,
    },
    lightbox: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Array as PropType<{ name: string, icon: string, description?: string }[]>,
      default: () => [],
    },
    cta: {
      type: String,
      default: 'Add',
    },
    viewOnly: {
      type: Boolean,
      default: false,
    },
    showQuantity: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { getImageSrc, getImageSrcSet } = useImageResizer();
    /* We need to support both external and internal links,
     * since we are in a state where some pages can be linked to, but not others.
     *
     * Internal links should use a vue router object, and be rendered using nuxt link.
     * External links just use string and a tag.
     */
    const linkTag = computed(() => {
      if (props.link === 'div' || (props.link as string).startsWith('div')) {
        return 'div';
      } else if (typeof props.link === 'string') {
        return 'a';
      }

      return 'nuxt-link';
    });

    const linkData = computed(() => {
      if (linkTag.value === 'a') {
        return { href: props.link };
      } else if (linkTag.value === 'nuxt-link') {
        return { to: props.link };
      }
    });

    const addToCart = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      emit('click:add-to-cart');
    };

    return {
      linkTag,
      linkData,

      getImageSrcSet,
      getImageSrc,
      addToCart,
    };
  },
  methods: {
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers';

.sif-ds {
  .sif-product-card {
    --product-card-gutter: var(--spacer-sm);

    display: grid;
    grid-template-columns: var(--product-card-gutter) 1fr var(--product-card-gutter);
    grid-template-areas:
      ".  media  ."
      ". content ."
      ". actions .";

    text-decoration: none;
    color: var(--c-text); // non-themable per design.
    width: 100%;

    align-items: flex-start;
    align-content: flex-start;
    justify-items: flex-start;
    justify-content: flex-start;

    border: var(--border-base);

    @include for-desktop {
      --product-card-gutter: var(--spacer-lg);
    }

    h2 {
      font-family: var(--font-family-primary);
      line-height: var(--lh--tighter);
      font-size: var(--font-size--body-base);
      font-weight: var(--font-weight--normal);
    }

    &__media {
      grid-area: media;
      --aspect-ratio: 207 / 164;

      // aspect-ratio hack
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: calc(var(--aspect-ratio) * 100%);

    }

    picture {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;

      position: absolute;
      top: 15%;
      left: 20%;
      width: 60%;
      height: 70%;

      @include for-desktop {
        top: 25%;
        left: 16.66%;
        width: 66.66%;
        height: 55%;
      }

      img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
      }
    }

    &__tags {
      grid-column: -1/1;
      grid-row: 1/2;
      width: 100%;

      display: flex;
      justify-content: flex-end;

      padding: var(--spacer-xs);
    }

    &__content {
      grid-area: content;
      width: 100%;
      min-height: 4.5rem;

      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(2, auto);
      column-gap: var(--spacer-xs);

      padding-bottom: var(--spacer-xs);
      border-bottom: var(--border-base-dashed);

      &.view-only {
        border-bottom: none;
      }

      line-height: var(--lh--tight);
      font-size: var(--font-size--xs);

      @include for-desktop {
        font-size: var(--font-size--sm);
        grid-template-columns: 1fr max-content;
      }

      h3 {
        grid-row: 1/2;

        font-size: var(--font-size--sm);
        font-weight: var(--font-weight--bold);
        font-style: italic;
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing--lg);
        line-height: var(--lh--tighter);

        margin-bottom: .15em;

        @include for-desktop {
          font-size: var(--font-size--base);
        }
      }

      // Description:
      p {
        grid-row: 2/3;
      }

      // Nutritional info:
      div {
        grid-column: -1/1;
        grid-row: 3/4;

        text-align: left;

        @include for-desktop {
          grid-column: 2/-1;
          grid-row: 2/3;

          text-align: right;
        }
      }
    }

    &__actions {
      grid-area: actions;
      width: 100%;

      padding: var(--spacer-xs) 0;

      display: flex;
      flex-wrap: wrap;
      gap: 1ch;
      justify-content: center;
      align-items: center;

      .sif-price {
        color: inherit; // Use this component's main color. Otherwise .sif-price defaults to theme color.
        --price-font-size: var(--font-size--body-base);

        @include for-desktop {
          --price-font-size: 1.71rem;
        }

        .sif-price__currency {
          font-size: var(--font-size--body-2xs);

          @include for-desktop {
            font-size: var(--font-size--xs);
          }
        }
      }

      .sf-button {
        --button-padding: var(--spacer-xs);
        min-width: 4.5rem;
        font-size: var(--font-size--sm);
        margin-left: auto;

        // negate the theme, since we want to use default button styles.
        // --theme-background: initial;
        // --theme-color: initial;
        // --theme-color-mono-pairing: initial;

        @include for-desktop {
          min-width: 7rem;
          font-size: var(--font-size--base);
        }
      }
    }
  }
}
</style>
