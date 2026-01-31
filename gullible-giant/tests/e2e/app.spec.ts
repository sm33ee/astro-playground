import { expect, test } from '@playwright/test';

test('homepage highlights the starter', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Astro \+ Tailwind \+ React starter/i })
  ).toBeVisible();

  await expect(page.getByRole('link', { name: /Try the questionnaire/i })).toBeVisible();
});

test('questionnaire advances after a selection', async ({ page }) => {
  await page.goto('/questionnaire');

  await expect(page.getByRole('heading', { name: /What are you building first/i })).toBeVisible();

  await page.getByRole('button', { name: /Landing page/i }).click();

  await expect(
    page.getByRole('heading', { name: /Which tone fits the product/i })
  ).toBeVisible();
});
