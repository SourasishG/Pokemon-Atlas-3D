import { test, expect } from '@playwright/test';

test.describe('Pokémon Comparison E2E Journey', () => {
  test('user navigates to compare page and inspects stat metrics', async ({ page }) => {
    await page.goto('/compare');

    await expect(page.getByText(/3D Battle Comparison/i)).toBeVisible();
    await expect(page.getByText(/Select Pokémon A/i)).toBeVisible();
    await expect(page.getByText(/Select Pokémon B/i)).toBeVisible();
  });
});
