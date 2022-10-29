<template>
  <SfAddressPicker
    :selected="selected"
    @change="$value => selected = $value">
    <SfAddress
      v-for="address of blok.addresses"
      :key="address.name" v-editable="address"
      :name="address.name">
      <span>{{ address.name }}</span>
      <span>{{ address.street }}</span>
      <span>{{ address.postCode }}</span>
      <span>{{ address.city }}</span>
      <span>{{ address.country }}</span>
      <span>{{ address.phone }}</span>
    </SfAddress>
  </SfAddressPicker>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfAddressPicker } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfAddressPicker,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    return { selected: blok.selected };
  },
});
</script>
