import { computed, ref, useContext } from '@nuxtjs/composition-api';

export type Region = 'dk' | 'se' | 'us';
const ALLOWED_REGIONS: Region[] = ['dk', 'se', 'us'];
const DEFAULT_REGION: Region = 'us';

/**
 * Gets the current region based on the route url
 * override is used to test contexts where we don't use regions.
 * @param regionOverride
 */
export function useRegion(regionOverride?: string) {
  const { route } = useContext();
  const override = ref<string | undefined>(regionOverride);

  const pathPrefix = computed(() => {
    const path = route.value?.path ?? '';
    const prefixMatches = path.match(/^\/?([^\/]{2})(\/|$)/);
    return prefixMatches ? prefixMatches[1] : null;
  });

  const region = computed(() =>
    getRegion(override.value || pathPrefix.value || DEFAULT_REGION),
  );
  const language = computed(() => getLanguage(region.value));
  const apiRegion = computed(() => getApiRegion(region.value));
  const locale = computed(() => getLocale(region.value));
  const headers = computed(() => ({
    'Accept-Region': apiRegion.value,
    'Accept-Language': language.value,
  }));

  return {
    region,
    language,
    apiRegion,
    locale,
    headers,
  };
}

function getRegion(region: string): Region {
  if (!(ALLOWED_REGIONS as string[]).includes(region.toLowerCase())) {
    throw new Error(`region: ${region} is not supported`);
  }
  return region.toLowerCase() as Region;
}

function getLanguage(region: Region) {
  switch (region) {
    case 'dk':
      return 'da';
    case 'se':
      return 'sv';
    case 'us':
      return 'en';
    default:
      return '';
  }
}

function getApiRegion(region: Region) {
  switch (region) {
    // Re-mapping us -> la
    case 'us':
      return 'la';
    default:
      return region;
  }
}

function getLocale(region: Region) {
  switch (region) {
    case 'dk':
      return 'da-DK';
    case 'se':
      return 'sv-SE';
    default:
      return 'en-US';
  }
}
