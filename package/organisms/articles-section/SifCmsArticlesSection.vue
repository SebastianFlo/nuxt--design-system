<template>
  <section
    class="[ sif-articles-section ]"
    :class="[blok.theme && `theme--${blok.theme}`]">

    <SifCmsHeading
      v-if="blok.headline && blok.headline.length" v-editable="blok.headline[0]"
      :blok="blok.headline[0]"
      class="[ sif-articles-section__headline ]" />

    <div class="[ sif-articles-section__articles ]">
      <component
        :is="getLinkComponentType(article.link)" v-for="article of blok.article_items"
        :key="article._uid"
        v-editable="article" v-bind="getLinkProps(article.link)">
        <SfImage
          v-if="article.image.filename" :src="getImageSrc(article.image, { width: 460 })"
          sizes="(min-width: 1024px) 33vw, 100vw" :alt="article.image.description || article.image.alt" />

        <span class="[ sif-articles-section__category ]">{{ article.category }}</span>

        <h3> {{ article.title }} </h3>
        <p>{{ article.description }}</p>

        <SfButton class="sif-articles-section__read-more sf-button--pure">
          {{ blok.readMoreLabel }}
        </SfButton>

      </component>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfImage, SfButton } from '@storefront-ui/vue';
import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { getLinkComponentType, getLinkProps } from '../../base/helpers/storyblok-component.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfButton,
    SfImage,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { getImageSrc } = useImageResizer();

    return {
      getLinkComponentType,
      getLinkProps,
      getImageSrc,
      hasRichText,
      renderRichText,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-articles-section {
    color: var(--theme-color, var(--c-dark-green));
    background-color: var(--theme-background, none);
    padding: var(--spacer-base) var(--app-gutter);

    @include for-mobile {
      padding: var(--spacer-base) calc(2 * var(--app-gutter));
    }

    &__headline {
      // TODO: Standardize
      max-width: 50ch;
      margin-bottom: var(--spacer-lg);

      @include for-desktop {
        margin-bottom: var(--spacer-xl);
      }
    }

    &__articles {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
      grid-gap: var(--app-gutter);

      @include for-desktop {
        grid-template-columns: repeat(3, 1fr);
      }

      >a {
        display: flex;
        flex-direction: column;
        cursor: pointer;
        color: var(--theme-color, var(--c-dark-green));
        text-decoration: none;
        padding-bottom: var(--spacer-base);
        overflow: hidden;


        @include for-mobile {
          border-bottom: var(--border-base);
        }

        // TODO: Use typography helpers / extract
        .sif-articles-section__category {
          font-size: var(--font-size--sm);
          line-height: var(--lh--flat);
          margin-bottom: .75em;
        }

        img {
          width: 100%;
          transition: transform .25s;
        }

        .sf-image--wrapper {
          margin-bottom: var(--spacer-base);
        }

        h3 {
          font-family: var(--font-family--secondary);
          font-weight: var(--font-weight--light);
          font-size: var(--h3-secondary-font-size);
          line-height: var(--lh--tight);
        }

        p {
          margin-top: 1em;
          line-height: var(--lh--tight);
          padding-bottom: var(--spacer-base);
          border-bottom: 1px solid var(--theme-color, var(--c-dark));
        }

        .sif-articles-section__read-more {
          transition: transform 0.25s ease;
          color: var(--theme-color, var(--c-dark));
          text-align: left;
          transform-origin: top;
          transform: scaleY(0);
          overflow: hidden;
          justify-content: flex-start;

          &:hover {
            background: none;
          }

          @include for-mobile {
            max-height: 20px;
            padding-bottom: var(--spacer-2xs);
            transform: scaleY(1);
          }

          margin-top: 1em;
        }

        @include for-desktop {
          &:hover {
            img {
              transform: scale(1.05);
            }

            p {
              border: none;
            }

            .sif-articles-section__read-more {
              transform: scaleY(1);
              border-bottom: 1px solid var(--theme-color, var(--c-dark));
            }
          }
        }
      }
    }
  }
}
</style>
