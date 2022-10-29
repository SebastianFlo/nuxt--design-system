import { useAsync, useContext, useRoute, Ref } from '@nuxtjs/composition-api';
export function useStory<T = any>(options: {
  slug?: string;
  uuid?: string;
}): Ref<T> {
  if (!options.slug && !options.uuid) {
    throw new Error('Must provide either slug or uuid');
  }

  const context = useContext();
  const route = useRoute();
  const version =
    route.value.query._storyblok ?? (context.isDev || context.env.isPreview)
      ? 'draft'
      : 'published';

  const slugOrUuid = options.slug ?? options.uuid;
  const key = `useStory-${slugOrUuid}`;

  return useAsync(async () => {
    try {
      const result = await context.$storyapi.get(`cdn/stories/${slugOrUuid}`, {
        version,
        find_by: options.uuid ? 'uuid' : 'slug',
        resolve_relations: [
          'article.author',
          'faq.relatedQuestions',
          'meal-details.chef',
        ],
      });
      if (!result.data.story) {
        throw new Error('No data found');
      }

      return result.data.story;
    } catch (err) {
      context.error({
        message: `Unable to find matching story for slug or uuid: ${slugOrUuid}`,
      });
    }
  }, key);
}
