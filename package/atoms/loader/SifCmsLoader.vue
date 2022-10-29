<template>
  <SfLoader :loading="blok.loading">
    <div
      v-for="subBlok in blok.content"
      :key="subBlok.uuid" v-editable="subBlok">
      <component
        :is="getSifCmsComponentName(subBlok.component)"
        :blok="subBlok" />
    </div>
  </SfLoader>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfLoader } from '@storefront-ui/vue';
import { getSifCmsComponentName } from '../../base/helpers/storyblok-component.helpers';

export default defineComponent({
  components: {
    SfLoader,
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
