import { computed, useAsync, useContext } from '@nuxtjs/composition-api';
import { useRegion } from './use-region';

export interface DataSourceEntry {
  id: number;
  name: string;
  value: string;
  // eslint-disable-next-line
  dimension_value?: string;
}

export function useDatasource(
  key: string,
  options?: {
    regionOverride?: string;
  },
) {
  const { $storyapi } = useContext();
  const cacheKey = `useDatasource:${key}`;
  const { locale } = useRegion(options?.regionOverride);

  const dataSource = useAsync<DataSourceEntry[]>(async () => {
    const result = await $storyapi.get('cdn/datasource_entries', {
      datasource: key,
      dimension: locale.value,
    });

    const entries = result.data?.datasource_entries;
    if (!entries?.length) {
      throw new Error(`Found no datasource with key ${key}`);
    }

    return entries;
  }, cacheKey);

  const dataSourceLookup = computed(() => {
    const lookup = {};
    for (const entry of dataSource.value ?? []) {
      lookup[entry.name] = entry.dimension_value ?? entry.value;
    }
    return lookup;
  });

  return {
    dataSource,
    dataSourceLookup,
  };
}
