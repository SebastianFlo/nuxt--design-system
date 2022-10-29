import { onMounted, onUnmounted, ref } from '@vue/composition-api';

/**
 * Gets various device information.
 */
export function useDeviceInfo() {
  const isMobile = ref(false);
  const isDesktop = ref(false);

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 1024;
    isDesktop.value = window.innerWidth >= 1024;
  };

  onMounted(() => {
    window.addEventListener('resize', checkIsMobile);
    checkIsMobile();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile);
  });

  return {
    isMobile,
    isDesktop,
  };
}
