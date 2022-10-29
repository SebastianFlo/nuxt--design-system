<template>
  <SifMealDetails
    :meal="meal" :chef-card-title="blok.chefCardTitle"
    :labels="{
      readMore: blok.descriptionReadMoreLabel,
      readLess: blok.descriptionReadLessLabel,
      nutritionals: blok.nutritionalsLabel,
      allergens: blok.allergensLabel,
      contents: blok.contentsLabel,
      preparations: blok.preparationsLabel,
      orderBefore: blok.orderBeforeLabel,
      calories: blok.caloriesLabel,
      fat: blok.fatLabel,
      carbs: blok.carbLabel,
      protein: blok.proteinLabel,
    }" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api';
import SifMealDetails from './SifMealDetails.vue';

export default defineComponent({
  components: {
    SifMealDetails,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    const menu = ref({
      meals: [],
    });
    const meal = computed(() => menu.value?.meals[0]);

    return {
      meal,
    };
  },
});
</script>
