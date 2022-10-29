import 'gsap/types';

declare module 'vue/types/vue' {
  interface Vue {
    $gsap: GSAP;
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $gsap: GSAP;
  }
}

// Nuxt 2.9+
declare module '@nuxt/types' {
  interface Context {
    $gsap: GSAP;
  }
}
