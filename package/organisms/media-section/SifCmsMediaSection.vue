<template>
  <section
    class="[ media-section ]"
    :class="[blok.theme && `theme--${blok.theme}`]">
    <!-- if Video -->
    <div
      v-if="isVideo && blok.mediaDesktop && blok.mediaMobile"
      class="[ center ]">
      <video
        class="[ media-section--is-mobile lazyload ]" autoplay
        playsinline muted
        loop
        :data-src="blok.mediaMobile.filename" type="video/mp4" />

      <video
        class="[ media-section--is-desktop lazyload ]" autoplay
        playsinline muted
        loop
        :data-src="blok.mediaDesktop.filename" type="video/mp4" />
    </div>

    <!-- TODO: if Image -->
    <SfImage
      v-if="!isVideo && blok.mediaDesktop.filename" :srcsets="getImageSources(blok.mediaDesktop, {
        ratio: 1024 / 670
      })"
      sizes="100vw" loading="lazy"
      :src="getImageSrc(blok.mediaDesktop, { width: 704, ratio: 1024 / 670 })"
      :alt="blok.mediaDesktop.alt" />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { SfImage } from '@storefront-ui/vue';
import { useImageResizer } from '../../base/hooks/image-resizer/use-image-resizer';

export default defineComponent({
  components: {
    SfImage,
  },
  props: {
    blok: {
      type: Object as PropType<{
        mediaDesktop: any,
      }>,
      required: true,
    },
  },
  setup({ blok }) {
    const { getImageSources, getImageSrc } = useImageResizer();

    const isVideo = computed(() => {
      if (!blok.mediaDesktop) {
        return false;
      }

      return !!(blok.mediaDesktop.filename?.endsWith('mp4'));
    });

    return {
      isVideo,

      getImageSources,
      getImageSrc,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.sif-ds {
  .media-section {
    width: 100%;

    video {
      max-width: 100%;
      object-fit: cover;
      display: none;
      width: 100%;

      @include for-mobile {
        &.media-section--is-mobile {
          display: block;
        }
      }

      @include for-desktop {
        &.media-section--is-desktop {
          display: block;
        }
      }
    }

    .sf-image {
      width: 100%;
    }
  }
}
</style>
