<template>
  <article class="sif-faq">
    <!-- TODO: rename header -> title -->
    <h1>{{ blok.header }}</h1>
    <div
      v-if="hasRichText(blok.content)" class="sif-faq__body"
      v-html="renderRichText($storyapi, blok.content, { unwrap: true })" />
    <aside v-if="relatedQuestions && relatedQuestions.length">
      <h2 v-if="blok.relatedQuestionsHeader">
        {{ blok.relatedQuestionsHeader }}
      </h2>
      <ul>
        <li
          v-for="link in relatedQuestions"
          :key="link._uid" v-editable="link.content">
          <SfLink :link="{ path: '/' + link.full_slug }">
            {{ link.content && link.content.header }}
          </SfLink>
        </li>
      </ul>
    </aside>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, useRoute } from '@nuxtjs/composition-api';
import { SfLink } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { useStories } from '../../base/hooks/use-stories';

export default defineComponent({
  components: {
    SfLink,
  },
  props: {
    blok: {
      type: Object as PropType<{
        content: any,
        relatedQuestions: any[],
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const route = useRoute();

    const parent = route.value.path.replace(/[^\/]+$/, '').slice(1);
    const items = useStories({ starts_with: parent });

    const relatedQuestions = computed(() => {
      if (blok.relatedQuestions?.length) {
        return blok.relatedQuestions;
      }

      if (items.value?.length) {
        return items.value.filter(item => `/${item.full_slug}` !== route.value.path);
      }
    });

    return {
      relatedQuestions,

      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-faq {
    display: flex;
    flex-direction: column;

    h1 {
      max-width: 25ch;

      font-size: var(--font-secondary-size--title-lg);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--light);
      line-height: var(--lh--tighter);
    }

    &__body {
      max-width: 75ch;

      >*+* {
        margin-top: 1.25em;
      }

      >h3+p {
        margin-top: .5rem;
      }

      *+h2 {
        margin-top: calc(var(--article-vertical-rhythm) * 2em);
      }

      // links
      a {
        color: var(--c-text);
        font-weight: var(--font-weight--normal);
      }

      h2 {
        line-height: var(--lh--tight);
        font-size: var(--font-size--title-sm);
        font-weight: var(--font-weight--normal);
        text-transform: uppercase;
      }

      h3 {
        line-height: var(--lh--tight);
        font-size: var(--font-size--body-lg);
        font-weight: var(--font-weight--normal);
        text-transform: uppercase;
      }

      h4,
      h5,
      h6 {
        font-weight: var(--font-weight--bold);
      }
    }

    aside {
      width: 100%;
      border-top: var(--border-base);
      margin-top: var(--spacer-xl);
      padding-top: var(--spacer-base);

      ul {
        display: flex;
        flex-direction: column;
      }

      ul,
      li {
        list-style: none;
        padding: 0;
        margin-left: 0;
      }

      li+li {
        margin-top: 1em;
      }
    }
  }
}
</style>
