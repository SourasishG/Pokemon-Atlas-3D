import { test, expect } from '@playwright/test';

test.describe('Pokédex Search & Filter E2E Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('user navigates to Pokédex and searches for a Pokémon', async ({ page }) => {
    // Navigate to explorer page
    await page.click('text=Pokédex Atlas');
    await expect(page).toHaveURL(/\/explorer/);

    // Search for pikachu
    const searchInput = page.getByPlaceholder(/search pokémon by name/i);
    await searchInput.fill('pikachu');

    // Verify search card appears
    await expect(page.getByText('Pikachu')).toBeVisible();
    await expect(page.getByText('#0025')).toBeVisible();
  });

  test('user filters Pokémon by Electric type', async ({ page }) => {
    await page.goto('/explorer');

    // Click 'electric' type filter pill
    await page.getByRole('button', { name: /electric/i }).click();

    // Verify pikachu is listed
    await expect(page.getByText('Pikachu')).toBeVisible();
  });

  test('user opens 3D detail page for Pikachu', async ({ page }) => {
    await page.goto('/pokemon/pikachu');

    await expect(page.getByText('Pikachu')).toBeVisible();
    await expect(page.getByText(/Base Stats/i)).toBeVisible();
  });
});
