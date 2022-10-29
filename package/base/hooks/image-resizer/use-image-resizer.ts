import { useContext } from '@nuxtjs/composition-api';
import { Breakpoint, Image, SourceSet } from './image-resizer.models';
import { getStoryblokImageSources } from './storyblok-image-resizer';

export interface ResizerOptions {
  /**
   * Controls the ratio of the image.
   * Use this when you want to force a ratio, that might not be consistent with the actual
   * image ratio that you have from cms etc.
   *
   * Above 1 means landscape, below 1 is portrait
   * ex: ({ ratio: 16/9 } -> image height adjusted to fit 16/9.
   *
   * If you need more control across different breakpoints, orientations etc,
   * use a picture element, and switch between ratios based on media queries.
   */
  ratio?: number;

  // The target breakpoints that this image should be resized for.
  breakpoints?: Breakpoint[];

  // Alternative to breakpoints: just use a single height.
  width?: number;

  // The target quality percentage for the image.
  quality?: number;

  // Image format
  format?: string;
}

// Default quality (compression) applied to all images.
const DEFAULT_QUALITY = 80;

export function useImageResizer(baseOptions?: ResizerOptions) {
  const { env } = useContext();

  const getImageSources = (
    imageOrUrl: Image | string | { filename: any },
    options?: ResizerOptions,
  ) => {
    // Support both image objects and strings
    const image: Image =
      typeof imageOrUrl === 'string'
        ? { filename: imageOrUrl, description: '' }
        : (imageOrUrl as Image);

    if (!image) {
      return [];
    }

    // Setting up configuration
    let breakpoints = options?.breakpoints ?? env.IMAGE_RESIZER_BREAKPOINTS;

    if (!options?.breakpoints && options?.width) {
      breakpoints = [{ breakpoint: 0, width: options.width }];
    }

    return getStoryblokImageSources(image, {
      breakpoints,
      quality: DEFAULT_QUALITY,
      ...baseOptions,
      ...options,
    });
  };

  const getImageSrcSet = (
    imageOrUrl: Image | string | { filename: any },
    options?: ResizerOptions,
  ) => {
    const sources = getImageSources(imageOrUrl, options);
    return convertToSrcSet(sources);
  };

  const getImageSrc = (
    imageOrUrl: Image | string,
    options?: ResizerOptions,
  ) => {
    const sources = getImageSources(imageOrUrl, options);
    return sources.length ? sources[0].src : null;
  };

  return {
    getImageSources,
    getImageSrcSet,
    getImageSrc,
  };
}

/**
 * Check if the provide object or string matches the storyblok url.
 */
// function isStoryBlokImage(imageOrUrl: Image | string | null) {
//   const filename =
//     typeof imageOrUrl === 'string' ? imageOrUrl : imageOrUrl?.filename;

//   return !!filename?.includes('storyblok.com');
// }

/**
 * Builds a responsive srcset value based on a cms image model.
 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
 */
function convertToSrcSet(sources: SourceSet[]) {
  if (sources.length === 1) {
    return sources[0].src;
  }

  return sources.map((source) => `${source.src} ${source.width}w`).join(', ');
}
