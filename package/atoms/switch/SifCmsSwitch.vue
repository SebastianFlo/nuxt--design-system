<template>
  <SifSwitch
    :selected-index="selectedIndex"
    @change="($event) => selectedIndex = $event.index">
    <SifSwitchItem
      v-for="(item, index) of blok.items" :key="index"
      :label="item.label" :value="item.value || ''"
      :selected="index === selectedIndex" name="switch">
      <p
        v-if="hasRichText(item.description)" slot="description"
        v-html="renderRichText($storyapi, item.description, { unwrap: true })" />
    </SifSwitchItem>
  </SifSwitch>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import SifSwitch from './SifSwitch.vue';

export default defineComponent({
  components: {
    SifSwitch,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const selectedIndex = ref(parseInt(props.blok.index || 0));

    return {
      selectedIndex,

      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
</style>
