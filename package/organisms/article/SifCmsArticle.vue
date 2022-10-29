<template>
  <article
    class="sif-article" :class="{
      'sif-article--no-media': !blok.media || (!isImage(blok.media) && !isVideo(blok.media))
    }">
    <h1
      v-if="hasRichText(blok.title)"
      v-html="renderRichText($storyapi, blok.title, { unwrap: true })" />
    <div
      v-if="!blok.hideMeta"
      class="sif-article__meta">
      <time :datetime="blok.date">
        {{ readableTime(blok.date) }}
      </time>
      <span
        v-for="tag of blok.tags"
        :key="tag">{{ tag }}</span>
      <span v-if="readingTimeMinutes">{{ readingTimeMinutes }}</span>
    </div>
    <figure
      v-if="blok.media && blok.media.filename"
      class="sif-article__media">
      <img
        v-if="isImage(blok.media)" :srcset="getImageSrcSet(blok.media, {
          breakpoints: [{
            breakpoint: 0, width: 640,
            breakpoint: 860, width: 1440,
            breakpoint: 1024, width: 2048,
          }],
        })"
        media="100vw" :alt="blok.media.alt"
        width="852" height="740">
      <video
        v-if="isVideo(blok.media)"
        autoplay playsinline
        muted loop
        :src="blok.media.filename" type="video/mp4" />
      <figcaption
        v-if="hasRichText(blok.mediaCaption)"
        v-html="renderRichText($storyapi, blok.mediaCaption, { unwrap: true })" />
    </figure>
    <aside
      v-if="blok.author && blok.author.content"
      v-editable="blok.author.content" class="sif-article__author">
      <img
        v-if="blok.author.content.image && blok.author.content.image.filename" width="150"
        height="150"
        :src="getImageSrc(blok.author.content.image, { width: 150 })"
        :alt="blok.author.content.image.description || blok.author.content.image.alt" />
      <div>
        <h3>{{ blok.author.content.name }}</h3>
        <span>{{ blok.author.content.title }}</span>
        <p
          v-if="hasRichText(blok.author.content.bio)"
          v-html="renderRichText($storyapi, blok.author.content.bio, { unwrap: true })" />
      </div>
    </aside>
    <div
      v-if="hasRichText(blok.body)"
      ref="body" class="sif-article__body"
      v-html="renderBody(blok.body)" />
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useRoute } from '@nuxtjs/composition-api';

import { hasRichText, renderRichText } from '../../base/helpers/storyblock-richtext.helper';
import { useRegion } from '../../base/hooks/use-region';
import { formatDate, createStoryblokDate } from '../../base/helpers/date.helpers';
import { getReadingTimeMinutes } from '../../base/helpers/string.helpers';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const body = ref<null | Element>(null);

    const { getImageSrcSet } = useImageResizer();
    const { $storyapi } = useContext();
    const { locale } = useRegion();
    const route = useRoute();
    const { getImageSrc } = useImageResizer();

    $storyapi.setComponentResolver((name, data) => {
      switch (name) {
        case 'scroll-to': {
          return `<div id="${data.id}" />`;
        }

        case 'figure': {
          const img = `<img src="${data.media.filename}" alt="${data.media.alt}" />`;
          const caption = $storyapi.richTextResolver.render(data.caption);
          return `<figure>${img}<figcaption>${caption}</figcaption></figure>`;
        }
      }
    });

    const isImage = (media?: { filename: string }) => {
      return /(jpe?g|png|webp|svg)$/i.test(media?.filename ?? '');
    };
    const isVideo = (media?: { filename: string }) => {
      return /mp4$/i.test(media?.filename ?? '');
    };

    const renderBody = (data: any) => {
      return $storyapi.richTextResolver.render(data);
    };

    const readableTime = (value: string) => {
      const date = createStoryblokDate(value);
      return formatDate(date, { locale: locale.value });
    };

    const readingTimeMinutes = computed(() => {
      if (!body.value?.textContent) {
        return '';
      }

      return getReadingTimeMinutes(body.value.textContent, { locale: locale.value });
    });

    // Hack for iOS/safari to scroll to element;
    onMounted(() => {
      if (route.value.hash) {
        const scrollToEl = document.querySelector(route.value.hash);
        console.log('hash', route.value.hash);
        if (!scrollToEl) {
          return;
        }

        scrollToEl.scrollIntoView();
      }
    });

    return {
      body,

      readingTimeMinutes,

      isImage,
      isVideo,
      getImageSrc,
      hasRichText,
      renderRichText,
      renderBody,
      readableTime,
      getImageSrcSet,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .sif-article {
    // styling API
    --article-inner-width: 42rem;
    --article-breakout-width: 54rem;
    --article-vertical-rhythm: 1.25;

    background: var(--c-light);
    padding: var(--spacer-xl) 0 var(--spacer-2xl);

    // Used for the main headline, and any colored lines etc. on the page.
    --article-accent-color: var(--c-blue);

    // private calculated values
    --article-breakout-gutter: calc((var(--article-breakout-width) - var(--article-inner-width)) / 2);
    --article-capped-inner: min(var(--article-inner-width), calc(100% - (2 * var(--app-gutter))));

    // Set up the grid both on top level, and on "body",
    // to make sure we align the widths.
    // NOTE: when subgrid is available, add grid on top level only,
    // and subgrid on body
    &,
    &__body {
      display: grid;
      grid-template-columns:
        minmax(var(--app-gutter), auto) minmax(auto, var(--article-breakout-gutter)) var(--article-capped-inner) minmax(auto, var(--article-breakout-gutter)) minmax(var(--app-gutter), auto);

      >* {
        grid-column: -1/1;
      }
    }

    >h1 {
      grid-column: 3 / span 1;

      // TODO: extract
      max-width: 25ch;
      margin-left: auto;
      margin-right: auto;

      font-size: var(--font-secondary-size--title-lg);
      font-family: var(--font-family--secondary);
      text-align: center;
      font-weight: var(--font-weight--light);
      line-height: var(--lh--tighter);
    }

    // With no media, the center aligned h1 looks a bit weird
    &.sif-article--no-media>h1 {
      text-align: left;
      margin-right: auto;
      margin-left: 0;
    }

    // Meta bar (if shown)
    &__meta {
      grid-column: 2 / span 3;
      width: 100%;

      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      gap: 0 1ch;

      >*+*::before {
        content: "|";
        padding-right: 1ch;
      }

      color: var(--c-dark-lighten);
    }

    // Top media
    &__media {
      width: 100%;
      margin: 2rem 0;

      >figcaption {
        max-width: var(--article-capped-inner);
        margin-left: auto;
        margin-right: auto;
      }
    }

    // Author
    &__author {
      grid-column: 3 / span 1;

      display: flex;
      margin-bottom: var(--spacer-lg);
      font-size: var(--font-size--body-sm);

      img {
        max-width: 10rem;
        max-width: min(10rem, 33vw);
        object-fit: cover;
        object-position: center;
      }

      h3 {
        flex-grow: 1;
        text-transform: uppercase;
        font-size: var(--font-size--body-base);
      }

      >div {
        width: 100%;
        padding: var(--spacer-sm) var(--spacer-base);
        border: var(--border-base);

        *+* {
          margin-top: 1em;
        }
      }

      p {
        overflow: hidden;
        text-overflow: ellipsis;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .sif-article__author+.sif-article__body>p:first-child::first-letter {
      float: left;
      padding: .1ch .1ch 0 0;

      font-size: 4em;
      line-height: .75em;
    }

    // Main content
    &__body {
      >* {
        grid-column: 3 / span 1;
      }

      // vertical flow
      >*+* {
        margin-top: calc(var(--article-vertical-rhythm) * 1em);
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

      // Breakout elements go here
      figure,
      blockquote {
        grid-column: 2 / span 3;

        &+* {
          margin-top: 0;
        }
      }

      figure {
        margin: 2rem 0;
        max-width: var(--article-capped-inner);
      }

      figcaption {
        max-width: min(100%, var(--article-inner-width));
      }

      blockquote {
        margin: 2rem 0;

        color: var(--article-accent-color);
        line-height: var(--lh--tight);
        font-family: var(--font-family--secondary);
        font-size: var(--font-secondary-size--title-sm);
        font-weight: var(--font-weight--light);
        text-align: center;
      }
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

    figcaption {
      width: 100%;
      margin: .5em auto 0;
      padding-bottom: .5em;

      font-style: oblique;
      font-size: var(--font-size--body-sm);

      border-bottom: 2px solid var(--article-accent-color);
    }

    video,
    figure {
      max-width: 100%;
      width: 100%;
    }

    img {
      width: 100%;
    }
  }
}
</style>
