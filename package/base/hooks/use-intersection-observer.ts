import {
  computed,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  watch,
} from '@nuxtjs/composition-api';

/**
 * Composable with easy to use API for all your intersection observer needs.
 * @param target The target element reference
 * set it up like this:
 * ```
 * <template>
 *  <div ref="container" />
 * </template>
 *
 * ...
 * setup() {
 *  const container = ref<Element|null>(null);
 *  const { ... } = useIntersection(container);
 *  return { container };
 * }
 * ...
 * ```
 * @param options
 * The intersection observer options.
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * Useful for all sorts of cases.
 */

interface Options extends Omit<IntersectionObserverInit, 'root'> {
  root?: Ref<Element | null>;
}

export function useIntersectionObserver(
  target: Ref<Element | null>,
  options?: Options,
) {
  const isViewAboveElement = ref(false);
  const isViewBelowElement = ref(false);
  const isElementInView = ref(false);

  const root = computed(() => options?.root?.value ?? null);

  // The main callback for intersections
  const handler: IntersectionObserverCallback = ([entry]) => {
    if (!entry) {
      return;
    }

    isElementInView.value = entry.isIntersecting;

    if (entry.isIntersecting) {
      isViewAboveElement.value = false;
      isViewBelowElement.value = false;
    } else {
      isViewAboveElement.value = entry.boundingClientRect.top > 0;
      isViewBelowElement.value = entry.boundingClientRect.top <= 0;
    }
  };

  let observer: IntersectionObserver | null = null;

  // mounts the intersection observer, if we have a valid target.
  const mount = () => {
    if (!target.value) {
      return;
    }

    // make sure to disconnect the listener, if any.
    disconnectViewportListener();
    observer = new IntersectionObserver(handler, {
      ...options,
      root: root.value,
    });
    observer.observe(target.value);
  };

  // You can call this from the outside if you want (rarely needed).
  const disconnectViewportListener = () => observer?.disconnect();

  // Set up the listener on load if able,
  // and set up a watcher to start the listener when the root or value changes.
  // This enables us to pass in element references that are not yet initialized,
  // and this watcher will mount them when they are ready.
  onMounted(() => {
    mount();

    watch([target, root], (el) => {
      if (!el) {
        disconnectViewportListener();
      } else {
        mount();
      }
    });
  });

  // Makes sure to clean up
  onUnmounted(disconnectViewportListener);

  return {
    isViewAboveElement,
    isViewBelowElement,
    isElementInView,
    disconnectViewportListener,
  };
}
