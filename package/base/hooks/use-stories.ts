import { useAsync, useContext, useRoute, Ref } from '@nuxtjs/composition-api';
import { StoriesParams } from 'storyblok-js-client';
// import {  } from '@nuxt/http';

interface HttpError {
  response: {
    status: number;
    data: any;
  };
}

export interface Story {
  name: string;
  // eslint-disable-next-line
  full_slug: string;
  content: {
    component: string;
    headline: string;
    intro: any;
    body: any[];
  };
  path: string;
}

export function useStories<T = Story>(params?: StoriesParams): Ref<T[] | null> {
  const context = useContext();
  const route = useRoute();
  const version =
    route.value.query._storyblok ?? (context.isDev || context.env.isPreview)
      ? 'draft'
      : 'published';

  const key = `useStories-${JSON.stringify(params ?? '')}`;

  return useAsync(async () => {
    let stories: T[] = [];

    try {
      stories = await context.$storyapi.getAll('cdn/stories', {
        ...params,
        version,
      });

      if (!stories?.length) {
        throw new Error('no stories found');
      }
    } catch (err) {
      const statusCode = (err as HttpError).response?.status ?? 404;
      const message =
        (err as HttpError).response?.data ??
        'Failed to receive content from API';
      context.error({ statusCode, message });
    }

    return stories;
  }, key);
}
