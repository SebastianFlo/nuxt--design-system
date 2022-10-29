<template>
  <section
    class="sif-membership-select-section">
    <div class="sif-membership-select-section__heading">
      <SifCmsHeading
        v-if="blok.heading && blok.heading[0]"
        v-editable="blok.heading[0]" :blok="blok.heading[0]" />
    </div>
    <div class="sif-membership-select-section__description">
      <div
        v-if="hasRichText(blok.description)"
        v-html="renderRichText($storyapi, blok.description, { unwrap: true })" />
    </div>
    <div class="sif-membership-select-section__selector">
      <div class="sif-membership-select-section__selector-monthly">
        <div class="sif-membership-select-section__selector-monthly-info">
          <h3>
            {{ blok.monthly_title }}
          </h3>

          <!-- <h2>
            {{ 'USD' }} {{ '8.00' }}
          </h2> -->

          <SifPrice
            :regular="'8.00'"
            :currency="'DKK'"
            :info="blok.monthly_description" />

          <!-- <p>
            {{ blok.monthly_description }}
          </p> -->
        </div>

        <SifCmsButton
          v-if="blok.monthly_cta && blok.monthly_cta.length"
          v-editable="blok.monthly_cta[0]"
          :blok="blok.monthly_cta[0]"
          :class="[blok.theme && `theme--${blok.theme}`]"
          @click="selectMembership('month')"
        />
      </div>

      <div class="sif-membership-select-section__selector-yearly">
        <SifCmsButton
          v-if="blok.yearly_cta && blok.yearly_cta.length"
          v-editable="blok.yearly_cta[0]"
          :blok="blok.yearly_cta[0]"
          :class="[blok.theme && `theme--${blok.theme}`]"
          @click="selectMembership('year')"
        />

        <div class="sif-membership-select-section__selector-yearly-info">
          <h3>
            {{ blok.yearly_title }}
          </h3>

          <SifPrice
            :regular="'60.00'"
            :currency="'DKK'"
            :info="blok.yearly_description" />

          <!-- <h2>
            {{ 'USD' }} {{ '8.00' }}
          </h2>

          <p>
            {{ blok.yearly_description }}
          </p> -->
        </div>
      </div>
    </div>


    <picture
      v-if="blok.yearly_savings_badge && blok.yearly_savings_badge.filename"
    >
      <source
        :srcset="getImageSrcSet(blok.yearly_savings_badge, {
          breakpoints: [{
            breakpoint: 0, width: 72,
            breakpoint: 1440, width: 72
          }],
          ratio: 72 / 72,
          format: 'webp'
        })"
        type="image/webp"
        sizes="(min-width: 1024px) 33vw, 100vw"
      >
      <img
        :src="getImageSrc(blok.yearly_savings_badge, { width: 72 })"
        :alt="blok.yearly_savings_badge.description || blok.yearly_savings_badge.alt"
        loading="lazy"
        width="72"
        height="72"
      >
    </picture>


    <div class="sif-membership-select-section__disclaimer">
      <div
        v-if="hasRichText(blok.disclaimer)"
        v-html="renderRichText($storyapi, blok.disclaimer, { unwrap: true })" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';
import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SifCmsHeading,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    const { getImageSrcSet, getImageSrc } = useImageResizer();

    const selectMembership = (membership: string) => {
      console.log('selected membership', membership);
    };

    return {
      getSifCmsComponentName,
      hasRichText,
      renderRichText,
      getImageSrcSet,
      getImageSrc,

      selectMembership,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-membership-select-section {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-template-areas:
      "heading"
      "description"
      "selector"
      "disclaimer";
    grid-gap: var(--spacer-lg);
    --gutter: var(--spacer-sm);
    padding: var(--spacer-sm) var(--gutter);

      &__heading {
        grid-area: heading;
      }

      &__description {
        grid-area: description;
        text-align: center;
        max-width: 50ch;
        justify-self: center;
      }

      &__selector {
        grid-area: selector;
        display: flex;
        justify-self: center;
        grid-gap: var(--spacer-2xl);
        flex-direction: column;

        @include for-desktop() {
          grid-gap: var(--spacer-base);
          flex-direction: row;
        }

        .sif-price {
          grid-template-columns: 1fr 1fr;
          grid-row-gap: var(--spacer-2xs);

          &__currency {
            align-self: center;
            justify-self: flex-end;
          }

          &__regular {
            justify-self: flex-start;
          }

          &__info {
            justify-self: center;
          }
        }

        &-monthly,
        &-yearly {
          display: flex;
          align-items: flex-start;
          grid-gap: var(--spacer-base);
          text-transform: uppercase;
        }
      }

      > picture {
        display: none;

        @include for-desktop() {
          display: block;
          grid-area: selector;
          justify-self: flex-end;
          margin-right: 15vw;
          // right: 18%;
          // bottom: 18%;
          // position: absolute;
        }
      }

      &__disclaimer {
        grid-area: disclaimer;
      }
  }
}
</style>
