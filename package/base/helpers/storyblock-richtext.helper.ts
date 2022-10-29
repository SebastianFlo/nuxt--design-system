import Storyblok from 'storyblok-js-client';
import { interpolate } from './string.helpers';

export function hasRichText(richtext: any) {
  const content = richtext?.content;
  return !!(content && content[0].content);
}

/**
 * Renders the rich text field to html using storyblok's rich text resolver.
 *
 * @param instance The storyblok js client instance
 * @param richtext The richtext field object from storyblok
 * @param options
 * {
 *   unwrap: makes sure that the result is not wrapped in extra divs, p's etc,
 *   values: pass any values you want to interpolate into the result,
 *     ex: renderRichText(instance, {"my name is {0}"}, { values: ["John"] }) -> "my name is John"
 * }
 */
export function renderRichText(
  instance: Storyblok,
  richtext: any,
  options?: {
    unwrap?: boolean;
    values?: any[];
  },
) {
  if (!instance || !instance.richTextResolver) {
    throw new Error(
      'Remember to pass Storyblok instance to "renderRichText()" helper',
    );
  }

  if (!hasRichText(richtext)) {
    return '';
  }

  const interpolated = interpolate(richtext, options?.values ?? []);
  const result = instance.richTextResolver.render(interpolated);

  if (options?.unwrap) {
    return unwrapElement(result);
  }

  return result;
}

// Removes the outer element of a rich result,
// in order to for instance remove excess wrapper paragraph.
export function unwrapElement(richtext: string): string {
  return richtext.replace(/(^<[^>]+>|<\/[^>]+>$)/gi, '');
}
