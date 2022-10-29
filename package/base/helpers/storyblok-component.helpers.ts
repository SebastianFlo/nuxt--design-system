import { RawLocation } from 'vue-router';

export function getSifCmsComponentName(name: string) {
  const replacedName = name
    .split(/[\s\-]/g)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

  return `SifCms${replacedName}`;
}

export interface Link {
  // eslint-disable-next-line camelcase
  cached_url?: string;
  url?: string;
  linktype: 'url' | 'story' | 'email';
}

interface BlokTableElement {
  _uid: string;
  value: string;
  component: '_table_col';
  _editable: string;
}

interface BlokTable {
  tbody: {
    _uid: string;
    body: BlokTableElement[];
    component: '_table_row';
    _editable: string;
  }[];
  thead: BlokTableElement[];
  fieldtype: 'table';
}

interface LinkOptions {
  hash?: string;
}

export function convertLinkToLocation(
  link: Link | null,
  options?: LinkOptions,
): RawLocation | null {
  const url = link?.cached_url || link?.url;
  if (!url) {
    return null;
  }

  if (link.linktype === 'url') {
    return options?.hash ? `${url}#${options.hash}` : url;
  }

  if (link.linktype === 'email') {
    return `mailto:${url}`;
  }

  // trim trailing slashes of the urls when targeting stories
  const sanitizedUrl = url.replace(/\/($|\?|#)/, '$1');

  return {
    path: options?.hash
      ? `/${sanitizedUrl}#${options.hash}`
      : `/${sanitizedUrl}`,
  };
}

// Used to determine which component to use for a link,
// since nuxt-link can only be used for internal linking, not for absolute urls.
export function getLinkComponentType(link: Link) {
  return link.linktype === 'url' ? 'a' : 'nuxt-link';
}

/**
 * Get the link properties to use for an <a> tag or <nuxt-link>,
 * depending on the type of link.
 * Very useful for this pattern:
 * <component
 *  :is="getLinkComponentType(link)"
 *  v-bind="getLinkProps(link)"
 * >
 *   ...
 * </component>
 */
export function getLinkProps(link: Link) {
  const type = getLinkComponentType(link);
  const location = convertLinkToLocation(link);

  if (type === 'nuxt-link') {
    return {
      to: location,
    };
  } else {
    return {
      href: location,
    };
  }
}

// Creates a map of values in a table with 2 columns. The first column is used as the key,
// and the second column is used as the value.
export function extractValuesFromTable(blokTable: BlokTable) {
  return blokTable.tbody.reduce((acc, curr) => {
    const key = curr.body[0].value;
    const value = curr.body[1].value;
    acc[key] = value;
    return acc;
  }, {});
}

// Used to determine which component to use for a location,
export function getLocationComponentType(location: RawLocation) {
  return typeof location === 'string' ? 'a' : 'nuxt-link';
}

// Same as getLinkProps, but for locations instead
export function getLocationProps(location: RawLocation) {
  const type = getLocationComponentType(location);

  if (type === 'nuxt-link') {
    return {
      to: location,
    };
  } else {
    return {
      href: location,
    };
  }
}

// Ensure we have a single slash between path parts, and a trailing slash.
export function buildPath(...parts: string[]) {
  const basePath = parts
    .map((part) => (part ?? '').replace(/(^\/?|\/?$)/g, ''))
    .join('/');
  return `${basePath}/`;
}
