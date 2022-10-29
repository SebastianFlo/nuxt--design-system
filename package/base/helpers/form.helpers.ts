export function getFormData(form: HTMLFormElement): { [key: string]: any } {
  const formData = new FormData(form);

  const lookup = {};
  // Not sure why typescript does not have this method
  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries
  for (const [key, value] of (formData as any).entries()) {
    lookup[key] = value;
  }

  return lookup;
}
