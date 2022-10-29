import StoryBlokClient from 'storyblok-js-client';

declare module '@nuxt/vue-app' {
  interface Context {
    $storyapi: StoryBlokClient;
    $storybridge: (cb: () => void, errorCb: () => string) => void;
  }
}

// Nuxt 2.9+
declare module '@nuxt/types' {
  interface Context {
    $storyapi: StoryBlokClient;
    $storybridge: (cb: () => void, errorCb: () => string) => void;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $storyapi: StoryBlokClient;
    $storybridge: (cb: () => void, errorCb?: () => string) => void;
  }
}
