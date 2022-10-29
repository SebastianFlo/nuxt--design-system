<template>
  <SifProductDetails
    class="sif-meal-details" :image="{
      filename: meal.image,
      description: meal.title,
      ratio: meal.imageRatio
    }"
    :background="meal.backgroundColor" :is-product="meal.product"
    :title="meal.title"
    :sub-title="meal.subTitle ? meal.subTitle[0].toUpperCase() + meal.subTitle.slice(1) : ''" :tags="meal.tags">
    <template
      v-if="isSoldOut"
      slot="info">
      <span v-html="require('../../base/icons/info.svg?raw')" />{{ labels.soldOut || 'sold out' }}
    </template>
    <template
      v-else-if="orderBeforeDate && labels.orderBefore"
      slot="info">
      <span v-html="require('../../base/icons/info.svg?raw')" />{{ interpolate(labels.orderBefore, [orderBeforeDate]) }}
    </template>

    <div
      v-if="meal.product && meal.description"
      v-html="convertMealRichTextToHTML(meal.description)" />

    <SifChefCard
      v-if="!hideChef && chefName(meal.chefName || meal.chef)" slot="box"
      :title="chefCardTitle"
      :name="chefName(meal.chefName || meal.chef)" :image="{
        filename: chefImage(meal.chefId || meal.chef),
        description: chefName(meal.chefName || meal.chef)
      }"
      :read-more-label="labels.readMore" :read-less-label="labels.readLess">
      <div
        v-if="meal.description"
        v-html="convertMealRichTextToHTML(meal.description)" />
    </SifChefCard>

    <section class="sif-meal-details__nutritionals">
      <h2>{{ labels.nutritionals || 'nutrition' }}</h2>
      <ul
        v-if="meal.nutritionalDetails && meal.nutritionalDetails.energyKCAL"
        slot="nutritionals">
        <li v-if="meal.nutritionalDetails.energyKCAL">
          <span>{{ labels.calories || 'calories' }}</span><span>{{ meal.nutritionalDetails.energyKCAL }} kcal</span>
        </li>
        <li v-if="meal.nutritionalDetails.proteinGR">
          <span>{{ labels.protein || 'protein' }}</span><span>{{ meal.nutritionalDetails.proteinGR }} g</span>
        </li>
        <li v-if="meal.nutritionalDetails.carbGR">
          <span>{{ labels.carbs || 'carbs' }}</span><span>{{ meal.nutritionalDetails.carbGR }} g</span>
        </li>
        <li v-if="meal.nutritionalDetails.fatGR">
          <span>{{ labels.fat || 'fat' }}</span><span>{{ meal.nutritionalDetails.fatGR }} g</span>
        </li>
      </ul>
      <div
        v-else-if="meal.nutritionals"
        v-html="convertMealRichTextToHTML(meal.nutritionals)" />
    </section>

    <div
      ref="accordion"
      slot="supportive-content" class="sif-accordion">
      <SifAccordionItem
        v-if="meal.allergens" :open="tab === 'allergens'"
        :header="labels.allergens"
        class="sif-accordion-item--small" @open="() => tab = 'allergens'">
        <div v-html="convertMealRichTextToHTML(meal.allergens)" />
      </SifAccordionItem>
      <SifAccordionItem
        v-if="meal.ingredients" :open="tab === 'contents'"
        :header="labels.contents || 'contents'"
        class="sif-accordion-item--small" @open="() => tab = 'contents'">
        <div v-html="convertMealRichTextToHTML(meal.ingredients)" />
      </SifAccordionItem>
      <SifAccordionItem
        v-if="meal.preparations" :open="tab === 'preparations'"
        :header="labels.preparations || 'preparations'" class="sif-accordion-item--small"
        @open="() => tab = 'preparations'">
        <div v-html="convertMealRichTextToHTML(meal.preparations)" />
      </SifAccordionItem>
    </div>
  </SifProductDetails>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { getTagIcon } from '../../atoms/tag/-tags.helper';
import { formatDate } from '../../base/helpers/date.helpers';
import { convertMealRichTextToHTML } from '../../base/helpers/meals.helpers';
import { interpolate } from '../../base/helpers/string.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';
import { useDatasource } from '../../base/hooks/use-datasource';
import { useRegion } from '../../base/hooks/use-region';
import SifAccordionItem from '../../molecules/accordion/SifAccordionItem.vue';
import SifProductDetails from '../../organisms/product-details/SifProductDetails.vue';

export default defineComponent({
  components: {
    SifAccordionItem,
    SifProductDetails,
  },
  props: {
    meal: {
      type: Object as PropType<any>,
      required: true,
      default: () => ({
        availability: 'NORMAL',
        lastOrderDate: null,
      }),
    },
    hideChef: {
      type: Boolean,
      default: false,
    },
    chefCardTitle: {
      type: String,
      default: '',
    },
    // labels (this is getting out of hand)
    labels: {
      type: Object as PropType<Record<string, string>>,
      default: () => { },
    },
  },
  setup(props) {
    const accordion = ref<HTMLElement | null>(null);

    const { getImageSrcSet, getImageSrc } = useImageResizer();
    const { locale } = useRegion();

    const { dataSourceLookup: chefImages } = useDatasource('chef-images');
    const { dataSourceLookup: chefNames } = useDatasource('chef-names');

    const isSoldOut = computed(() => props.meal.availability === 'OVERSOLD');

    const chefImage = (slug: string) => chefImages.value[slug?.toLowerCase() || 'rasmus_kliim'];
    const chefName = (slug: string) => chefNames.value[slug?.toLowerCase() || 'rasmus_kliim'];

    const orderBeforeDate = computed(() => {
      if (!props.meal.lastOrderDate) {
        return null;
      }

      return formatDate(new Date(props.meal.lastOrderDate), {
        locale: locale.value,
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    });

    const tab = ref<string | null>(null);

    return {
      accordion,
      tab,

      isSoldOut,
      orderBeforeDate,
      chefImage,
      chefName,

      getImageSrcSet,
      getTagIcon,
      getImageSrc,
      convertMealRichTextToHTML,
      interpolate,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-meal-details {
    &__nutritionals {
      margin-top: var(--spacer-base);
      font-size: var(--font-size--body-sm);

      h2 {
        margin-bottom: var(--spacer-sm);
        font-size: var(--font-size--body-base);

        font-family: inherit;
        font-weight: var(--font-weight--normal);
      }

      ul,
      li {
        list-style: none;
      }

      ul {
        padding: 0;
        margin: 0;
      }

      li {
        display: flex;
        justify-content: space-between;

        border-top: 1px dashed var(--c-dark-opacity-20);
        padding: var(--spacer-xs);
      }
    }
  }
}
</style>
