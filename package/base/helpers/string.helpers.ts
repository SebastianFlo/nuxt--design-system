import readingTime from 'reading-time';

export function capitalize(word: string) {
  return word
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase());
}

export function suffixForNumber(nb: number | string) {
  const pr = new Intl.PluralRules('en', { type: 'ordinal' });
  const suffix = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
  return suffix[pr.select(parseInt(nb.toString(), 10))];
}

export function camelToSnakeCase(key: string) {
  if (!key) {
    return key;
  }

  const matcher = /[a-z][A-Z\d]/g;
  return key.replace(matcher, (val) => `${val[0]}_${val[1]}`).toLowerCase();
}

export function interpolate(
  initial: string | Object,
  interpolations: string[] | Object,
  interpolationKeys: string[] | Object | null = null,
) {
  if (!initial) {
    return initial;
  }

  // initial can be a String or an Object;
  const isString = typeof initial === 'string';
  // values can be an array or and object. If an array, we transform into an object;
  const stringified = isString ? initial : JSON.stringify(initial);

  // If we use mapper functions, we need to transform the interpolations into an object
  let mappedInterpolations = interpolations;

  const keyArray = interpolationKeys && Array.isArray(interpolationKeys);
  if (interpolationKeys && !keyArray) {
    mappedInterpolations = Object.keys(interpolationKeys).reduce((acc, key) => {
      acc[key] = interpolationKeys[key](interpolations);
      return acc;
    }, interpolations);
  }

  const keys = keyArray
    ? Object.keys(interpolationKeys)
    : Object.keys(mappedInterpolations);

  const interpolated = interpolateString(
    stringified,
    mappedInterpolations,
    keys,
  );

  try {
    return isString ? interpolated : JSON.parse(interpolated);
  } catch (err) {
    return null;
  }
}

export function interpolateString(text, values, keys) {
  let replacedText = text ?? '';

  for (const key of keys) {
    const matcher = new RegExp(`\\{${key}\\}`, 'g');
    replacedText = replacedText.replace(matcher, values[key]?.toString() || '');
  }

  return replacedText;
}

// Get the approximate time to read a given string.
export function getReadingTimeMinutes(
  text: string,
  options: {
    locale: string;
    format?: Intl.NumberFormatOptions['unitDisplay'];
  },
) {
  if (!text) {
    return 0;
  }

  const { minutes } = readingTime(text);
  const fmt = Intl.NumberFormat(options.locale, {
    style: 'unit',
    unit: 'minute',
    unitDisplay: options.format ?? 'long',
  });

  return fmt.format(Math.ceil(minutes));
}
