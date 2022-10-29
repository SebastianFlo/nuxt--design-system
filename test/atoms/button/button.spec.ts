import { test, expect } from '@playwright/test';

test('primary button should match screenshot', async ({ page }) => {
  await page.goto('/atoms/button');
  const section$ = await page.waitForSelector(
    '*css=section >> text=Primary/Default',
  );
  const example$ = await section$.waitForSelector('.example__grid');

  expect(await example$.screenshot()).toMatchSnapshot('primary-button.png');
});
