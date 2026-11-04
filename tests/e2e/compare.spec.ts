import { test, expect } from '@playwright/test';

test.describe('Pokémon Comparison E2E Journey', () => {
  test('user navigates to compare page and inspects stat metrics', async ({ page }) => {
    await page.goto('/compare');

    await expect(page.getByText(/Compare Pokémon Specs/i)).toBeVisible();
    await expect(page.getByText(/Slot A Empty/i)).toBeVisible();
    await expect(page.getByText(/Slot B Empty/i)).toBeVisible();
  });
});
