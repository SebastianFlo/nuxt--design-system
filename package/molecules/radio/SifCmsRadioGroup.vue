<template>
  <div
    class="sif-radio-group" :class="{
      'sif-radio-group--vertical': blok.layout === 'vertical',
      'sif-radio-group--horizontal': blok.layout !== 'vertical'
    }">
    <SifCmsRadio
      v-for="item of internalItems" :key="item.uuid"
      v-editable="item" :blok="item"
      :selected="internalSelected" @change="onChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from '@nuxtjs/composition-api';
import SifCmsRadio from './SifCmsRadio.vue';

export default defineComponent({
  components: {
    SifCmsRadio,
  },
  props: {
    blok: {
      type: Object as PropType<{
        selected: string | null,
        items: {
          name: string,
          value: string,
          label: string,
          details: string,
        }[],
      }>,
      required: true,
    },
    selected: {
      type: String as PropType<string | null>,
      default: null,
    },
    values: {
      type: Array as PropType<string[]>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const internalSelected = ref(props.selected ?? props.blok.selected);
    const internalItems = ref(props.blok.items);

    watch(() => props.selected, (value: string | null) => {
      internalSelected.value = value;
    });

    watch(() => props.values, (values: string[] | null) => {
      if (!values?.length) {
        internalItems.value = props.blok.items;
        return;
      }

      internalItems.value = props.blok.items.filter(item => values.includes(item.value));
    }, { immediate: true });

    const onChange = (value: string) => {
      internalSelected.value = value;
      emit('change', value);
    };

    return {
      internalSelected,
      internalItems,

      onChange,
    };
  },
});
</script>

<style lang="scss">
.sif-ds {
  .sif-radio-group {
    --radio-group-pad-vertical: 1em;
    --radio-group-pad-side: 1.25em;

    display: flex;
    flex-direction: row;

    .sf-radio {
      --radio-pad-vertical: var(--radio-group-pad-vertical);
      --radio-pad-side: var(--radio-group-pad-side);
    }

    &--vertical {
      flex-direction: column;

      .sf-radio {
        margin-left: calc(-1 * var(--radio-group-pad-side));
      }
    }

    &--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
