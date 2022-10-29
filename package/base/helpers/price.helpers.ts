export function priceToTwoDigits(priceInCents: number | null) {
  if (priceInCents === null) {
    return null;
  }

  return (priceInCents / 100).toFixed(2);
}
