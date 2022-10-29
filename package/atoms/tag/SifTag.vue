<template>
  <div
    class="[ sif-tag sif-tooltip ]"
    :aria-title="name">
    <img
      :src="require('./icons/' + getTagIcon(icon.toUpperCase()))"
      width="32" height="32">
    <span class="sif-tooltip__text sif-tooltip--direction-up">{{ name }}</span>
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
    description: {
      type: String,
      default: '',
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
  .sif-tag {
    display: flex;
    align-items: center;
    font-size: var(--font-size--body-sm);

    img {
      stroke: var(--c-black);
    }

    @include for-mobile {
      font-size: var(--font-size--body-xs);

      img {
        width: 24px;
        height: 24px;
      }
    }

  }
}
</style>
