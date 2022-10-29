import { computed, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api';
import { throttle } from 'throttle-debounce';

export function useWindowScroll(options?: {
  // Minimum amount of ms between each scroll update sent to consumer.
  throttle?: number;
  // Minimum amount of scroll that should trigger a change in value.
  // useful if you dont want things to "flicker" if you scroll very small values up and down.
  threshold?: number;
}) {
  const throttleDelay = options?.throttle ?? 10;
  const threshold = options?.threshold ?? 0;

  // The current Y scroll value
  const scrollY = ref(0);

  // The current scroll direction
  const direction = computed(() => (diff.value < 0 ? 'up' : 'down'));

  // The difference from the last scroll Y.
  // NOTE: can be used to add speed/velocity later if we use precise timers
  const diff = ref(0);

  let prevScrollY = 0;

  // We throttle the handler, so we don't run into perf issues of
  // running this too much/changing values too often.
  const handler = throttle(throttleDelay, () => {
    prevScrollY = scrollY.value;

    if (Math.abs(window.scrollY - prevScrollY) < threshold) {
      return;
    }

    scrollY.value = window.scrollY;
    diff.value = window.scrollY - prevScrollY;
  });

  onMounted(() => {
    window.addEventListener('scroll', handler);
  });

  // You can call this as an outside consumer if you don't need
  // to use it anymore (special case).
  const removeListener = () => {
    window.removeEventListener('scroll', handler);
  };
  // Most cases onUnmounted is perfect to clean this up.
  onUnmounted(() => removeListener);

  return {
    scrollY,
    diff,
    direction,
    removeListener,
  };
}
