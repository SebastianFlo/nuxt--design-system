<template>
  <SifMealCard
    :title="blok.title" :image="blok.image"
    :is-narrow="blok.variant === 'teaser'"
    :badge="blok.isSoldOut ? 'sold out' : ''" :link="blok.link"
    :tags="createTags(blok.tags)">
    <SfButton slot="cta">
      + Add
    </SfButton>
    <span slot="info">
      calories: {{ parseInt(blok.calories) }}
    </span>
  </SifMealCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfButton } from '@storefront-ui/vue';
import SifMealCard from '../../organisms/meal-card/SifMealCard.vue';
import { renderRichText } from '../../base/helpers/storyblock-richtext.helper';

export default defineComponent({
  components: {
    SfButton,
    SifMealCard,
  },
  props: {
    blok: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  methods: {
    renderRichText,
    createTags(tags: string[]) {
      return tags.map(tag => ({
        id: Math.floor(Math.random() * 100000),
        title: tag,
        image: tag,
        description: 'no description',
      }));
    },
  },
});
</script>
