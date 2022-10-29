<template>
  <section
    :id="blok.id"
    class="sif-listing">
    <SifCmsHeading
      v-if="blok.heading && blok.heading.length"
      v-editable="blok.heading[0]" :blok="blok.heading[0]" />
    <ul>
      <li
        v-for="item in children"
        :key="item._uid" v-editable="item.content">
        <SifListingFaqItem
          v-if="item.content.component === 'faq'"
          :page="item" />
        <SifListingPageItem
          v-else
          :page="item" />
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, useRoute } from '@nuxtjs/composition-api';
import SifCmsHeading from '../../atoms/heading/SifCmsHeading.vue';
import { buildPath } from '../../base/helpers/storyblok-component.helpers';
import { useStories } from '../../base/hooks/use-stories';
import SifListingFaqItem from './_items/SifListingFaqItem.vue';
import SifListingPageItem from './_items/SifListingPageItem.vue';

export default defineComponent({
  components: {
    SifCmsHeading,

    // items
    SifListingFaqItem,
    SifListingPageItem,
  },
  props: {
    blok: {
      type: Object as PropType<{
        heading: any,
        subPath: string,
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const route = useRoute();

    const children = useStories({
      starts_with: buildPath(route.value.path, blok.subPath),
    });

    return {
      children,
    };
  },
});

</script>

<style lang="scss">
.sif-ds {
  .sif-listing {
    display: flex;
    flex-direction: column;

    ul {
      list-style: none;
      display: grid;

      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      grid-gap: var(--spacer-base);

      margin-top: var(--spacer-lg);
    }

    ul,
    li {
      padding: 0;
    }

    a {
      color: var(--c-text);
    }
  }
}
</style>
