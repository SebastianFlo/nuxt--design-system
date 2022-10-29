interface DateOptions extends Intl.DateTimeFormatOptions {
  format?: object;
  locale: string;
}

export function formatDate(date: Date | null, options: DateOptions) {
  if (!date || !(date instanceof Date)) {
    return null;
  }

  try {
    const fmt = Intl.DateTimeFormat(options.locale, options);
    return fmt.format(date);
  } catch (err) {
    return null;
  }
}

export function dateToText(date: Date | null, options: DateOptions) {
  return (
    new Intl.DateTimeFormat(options.locale, options.format).format(date!) || ''
  );
}

export function weekNumber(date: Date) {
  const oneJan = new Date(date!.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    ((date as any) - (oneJan as any)) / (24 * 60 * 60 * 1000),
  );
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}

// Creates a js date object from a storyblok date field value.
export function createStoryblokDate(value: string | Date) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  // Coerce the date to JSON, since Safari is not happy without it.
  // in: 2022-01-05 20:58
  // out: 2022-01-05T20:58:00.000Z
  const formattedValue = value.replace(
    /(\d{4}\-\d{2}\-\d{2})\s(\d{2}:\d{2})/,
    '$1T$2:00.000Z',
  );

  try {
    return new Date(formattedValue);
  } catch (err) {
    return null;
  }
}
