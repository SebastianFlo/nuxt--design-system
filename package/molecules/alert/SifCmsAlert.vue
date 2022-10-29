<template>
  <SfAlert
    :message="blok.text"
    :type="blok.type" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfAlert } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfAlert,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
});
</script>
