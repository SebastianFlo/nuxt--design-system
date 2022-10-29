import { SourceSet, Image, Breakpoint } from './image-resizer.models';

interface StoryblokResizeOptions {
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
  quality: number;
  format?: string;
  focus?: string;
  breakpoints: Breakpoint[];
}

/**
 * Builds a SfImage sources object
 * https://github.com/vuestorefront/storefront-ui/blob/develop/packages/vue/src/components/atoms/SfImage/SfImage.vue
 *
 * example:
 *  <SfImage :srcsets=buildImagesSources(blok.image) />
 */
export function getStoryblokImageSources(
  image: Image,
  options: StoryblokResizeOptions,
): SourceSet[] {
  const sources: SourceSet[] = [];

  for (const breakpoint of options.breakpoints) {
    const width = breakpoint.width;
    const height = options?.ratio ? width / options.ratio : 0;

    const url = image.filename
      ? buildStoryblokImageUrl(image, {
          ...options,
          width,
          height,
          focus: image?.focus,
        })
      : // If image url is missing (e.g. Content team forgot to upload an image), fall back to a placeholder image:
        'images/no_image.jpeg';
    // TODO provide a dynamic svg with variable dimensions?

    sources.push({
      src: url,
      width,
      breakpoint: breakpoint.breakpoint,
    });
  }

  return sources;
}

/**
 * To see the available resizing options, go to:
 * https://www.storyblok.com/docs/image-service
 */
interface StoryblokResizeAPIOptions {
  width: number;
  height: number;
  quality: number;
  format?: string;
  focus?: string;
  breakpoints: Breakpoint[];
}

/**
 * Builds a url using image proxy api.
 */
function buildStoryblokImageUrl(
  image: Image,
  resizeOptions: StoryblokResizeAPIOptions,
) {
  if (!image) {
    // This seems a bit too extreme, and breaks whole components in cases where content forgets to upload an image
    throw new Error(`unable to build image resizing url for image: ${image}`);
  }

  const shouldResize = !!resizeOptions.width;
  if (!shouldResize) {
    return image.filename;
  }

  const width = Math.round(resizeOptions.width);
  const height = resizeOptions.height ? Math.round(resizeOptions.height) : 0;
  const quality = resizeOptions.quality;

  const filters = [
    resizeOptions.format ? `format(${resizeOptions.format})` : null,
    resizeOptions.focus ? `focal(${resizeOptions.focus})` : null,
    `quality(${quality})`,
  ].filter(Boolean);

  // https://www.storyblok.com/docs/image-service
  const paramParts = [
    width || height ? `${width ?? 0}x${height ?? 0}` : null,
    filters.length ? `filters:${filters.join(':')}` : null,
  ].filter(Boolean);

  return `${image.filename}/m/${paramParts.join('/')}`;
}
