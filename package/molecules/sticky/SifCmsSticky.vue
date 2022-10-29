<template>
  <SifSticky
    :position="blok.position"
    :scroll-behavior="blok.scrollBehavior">
    <component
      :is="getSifCmsComponentName(item.component)" v-for="item of blok.content"
      :key="item._uid"
      v-editable="item" :blok="item" />
  </SifSticky>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';
import SifSticky from './SifSticky.vue';

export default defineComponent({
  components: {
    SifSticky,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getSifCmsComponentName,
  },
});
</script>
