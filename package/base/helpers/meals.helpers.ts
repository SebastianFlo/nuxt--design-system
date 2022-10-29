interface RichTextOptions {
  // in some situations it can be useful for all links to open in a new tab,
  // eg. when we don't want the user to leave the current page.
  openLinksInNewTab: boolean;
}

/**
 * Convert our own in house meals rich text syntax to a html text string.
 * @param richText The raw cms field value.
 * TODO: excellent candidate for unit tests, OR
 *       migrate to a different CMS with a better built in rich text language.
 */
export function convertMealRichTextToHTML(
  richText: string,
  options?: RichTextOptions,
) {
  if (!richText) {
    return null;
  }

  const { listItems, paragraphs } = splitRichText(richText);

  return `
    ${
      paragraphs.length
        ? paragraphs
            .map((paragraph) => `<p>${addMarks(paragraph, options)}</p>`)
            .join('\n')
        : ''
    }
    ${
      listItems.length
        ? `<ol>${listItems
            .map((listItem) => `<li>${addMarks(listItem, options)}</li>`)
            .join('\n')}</ol>`
        : ''
    }`;
}

function addMarks(value: string, options?: RichTextOptions) {
  const values = getMarkedText(value);

  return values
    .map((value) =>
      value.mark ? writeMark(value.text, value.mark, options) : value.text,
    )
    .join('\n');
}

function writeMark(value: string, mark: string, options?: RichTextOptions) {
  switch (mark) {
    case 'bold':
      return `<b>${value}</b>`;
    case 'link':
      return transformLinkMark(value, options);
    default:
      return value;
  }
}

/*
 * Extracts text and url from a mark value and outputs an html link.
 * ex:
 *   in -> click {LINK: TEXT:"here", URL:"https://example.com"}
 *   out -> click <a href="https://example.com" target="_blank">here</a>
 */
function transformLinkMark(value: string, options?: RichTextOptions) {
  const matcher = /\bTEXT:\s*["<]([^">]+)[">],\s*URL:\s*["<]([^">]+)[">]/;
  const matches = value.match(matcher);

  if (!matches) {
    return value;
  }

  const text = matches[1];
  const url = matches[2];

  if (options?.openLinksInNewTab) {
    return `<a href="${url}" target="_blank">${text}</a>`;
  } else {
    return `<a href="${url}">${text}</a>`;
  }
}

/**
 * Gets the marked text, eg. bold, links
 * ex: {BOLD:Næringsindhold pr. 100 g} Heraf mættede fedtsyrer
 * ex: click {LINK: TEXT:"here", URL:"https://example.com"}
 */
function getMarkedText(richText: string) {
  const result: { text: string; mark?: string }[] = [];
  const matcher = /\{([^:]+):([^\}]+)\}/gm;
  let match = matcher.exec(richText);
  let index = 0;

  while (match) {
    const matchIndex = match.index;
    const mark = match[1].trim().toLowerCase();
    const text = match[2];

    const pre = richText.slice(index, matchIndex);
    if (pre) {
      result.push({ text: pre });
    }

    result.push({ mark, text });

    index = matchIndex + match[0].length;
    match = matcher.exec(richText);
  }

  if (index !== richText.length) {
    const post = richText.slice(index);
    result.push({ text: post });
  }

  return result;
}

/**
 * Splits the meals rich text into lists and paragraphs based on custom syntax.
 * _NOTE: Don't touch this, it's very custom, and happens to work..._
 */
function splitRichText(richText: string) {
  // ex:   -{} Foo\n -{} Bar\n -{} Baz
  const listMatcher = /^\s*-.*\{\}\s*$/gm;
  const listMatches = richText.match(listMatcher);

  const listItems = (listMatches || [])
    .map((value) => value.trim().replace(/^-/, '').replace(/\{\}/, ''))
    // Make sure we have an actual string value in the list item
    .filter(Boolean);

  // ex:  #Which vegetable is the prettiest?\n Read more here.\n #It's Kale of course!
  const paragraphMatcher = /#/g;
  const paragraphs = richText
    .split(paragraphMatcher)
    .map((value) => value.trim())
    // Paragraphs cannot contain nested lists, and have to have a value.
    .filter((value) => !!value && !listMatcher.test(value));

  return { listItems, paragraphs };
}
