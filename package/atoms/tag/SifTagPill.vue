<template>
  <div class="sif-tag-pill">
    <img
      :src="require(`./icons/${getTagIcon(icon)}`)"
      width="20" height="20">
    <span>{{ name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { getTagIcon } from './-tags.helper';

export default defineComponent({
  props: {
    name: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      required: true,
    },
  },
  methods: {
    getTagIcon,
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-tag-pill {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: var(--font-size--body-xs);
    padding: 2px;
    border-radius: 2em;
    border: var(--border-base);

    span {
      padding: 0 1ch 0 .5ch;
      color: var(--c-dark-green-lighten);
    }
  }
}
</style>
