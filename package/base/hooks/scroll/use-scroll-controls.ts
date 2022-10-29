import { debounce } from 'throttle-debounce';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  Ref,
  watch,
} from '@nuxtjs/composition-api';

interface ScrollOptions {
  behavior?: ScrollBehavior | 'instant';
}

export function useScrollControls(
  element: Ref<Element | null>,
  options?: {
    index: number;
  },
) {
  // The index is null when we are not connect to an element yet.
  // this is to make sure we can
  const index = ref<number>(options?.index ?? 0);

  const scrollHandler = debounce(20, () => {
    index.value = getIndex();
    isAtEnd.value = getScrollIsAtEnd(element.value);
  });

  const isAtStart = computed(() => index.value === 0);
  const isAtEnd = ref(false);

  const connect = () => {
    element.value?.addEventListener('scroll', scrollHandler);

    // This happens when we load the component, and the desired/saved index is not 0.
    goTo(index.value, { behavior: 'instant' });
  };

  const disconnect = () => {
    element.value?.removeEventListener('scroll', scrollHandler);
  };

  const getIndex = () => {
    if (!element.value) {
      return 0;
    }

    const children = element.value.children;
    if (!children.length) {
      return 0;
    }

    const scrollLeft = element.value.scrollLeft;
    if (scrollLeft === 0) {
      return 0;
    }

    const innerBox = element.value.getBoundingClientRect();
    const offset = innerBox.left;

    for (let idx = 0; idx < children.length; idx++) {
      const child = children[idx];
      const { left } = child.getBoundingClientRect();
      if (left >= offset) {
        return idx;
      }
    }

    return children.length - 1;
  };

  const goTo = (target: number, options?: ScrollOptions) => {
    if (!element.value) {
      return;
    }

    if (options?.behavior === 'instant') {
      index.value = target;
    }

    const prevIndex = getIndex();
    // If the value was not changed, stop here.
    if (target === prevIndex) {
      return;
    }

    const children = element.value.children;
    // Make sure the value is not outside bounds.
    if (target > children.length - 1 || target < 0) {
      return;
    }

    const prevEl = children[prevIndex];
    const targetEl = children[target];

    const left =
      targetEl.getBoundingClientRect().x - prevEl.getBoundingClientRect().x;

    const behavior = (options?.behavior ?? 'smooth') as ScrollBehavior;
    element.value.scrollBy({ left, behavior });
  };

  const goBack = (options?: ScrollOptions) => goTo(index.value - 1, options);
  const goForward = (options?: ScrollOptions) => goTo(index.value + 1, options);

  onMounted(() => {
    watch(
      element,
      (elm) => {
        if (elm) {
          connect();
        } else {
          disconnect();
        }
      },
      { immediate: true },
    );
  });

  onUnmounted(disconnect);

  return {
    scrollIndex: index,
    isScrollAtStart: isAtStart,
    isScrollAtEnd: isAtEnd,

    goTo,
    goBack,
    goForward,
  };
}

function getScrollIsAtEnd(element: Element | null) {
  if (!element) {
    return false;
  }

  // check if the end of the element plus scroll is past the scroll width
  // the buffer is to ensure that it doesn't have to be all the way to the end,
  // just close to it.
  const buffer = 5;
  const scrollEnd = element.scrollLeft + element.getBoundingClientRect().width;
  return scrollEnd >= element.scrollWidth - buffer;
}
