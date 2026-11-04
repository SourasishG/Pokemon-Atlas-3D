import { test, expect } from '@playwright/test';

test.describe('Pokédex Search & Filter E2E Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('user navigates to Pokédex and searches for a Pokémon', async ({ page }) => {
    // Navigate to Pokédex page
    await page.getByRole('link', { name: /Pokédex/i }).first().click();
    await expect(page).toHaveURL(/\/pokedex/);

    // Search for pikachu
    const searchInput = page.getByPlaceholder(/search pokémon/i);
    await searchInput.fill('pikachu');

    // Verify search card appears
    await expect(page.getByText('Pikachu').first()).toBeVisible();
    await expect(page.getByText('#0025').first()).toBeVisible();
  });

  test('user filters Pokémon by Electric type', async ({ page }) => {
    await page.goto('/pokedex');

    // Click 'electric' type filter pill
    await page.getByRole('button', { name: /electric/i }).first().click();

    // Verify pikachu is listed
    await expect(page.getByText('Pikachu').first()).toBeVisible();
  });

  test('user opens 3D detail page for Pikachu', async ({ page }) => {
    await page.goto('/pokemon/pikachu');

    await expect(page.getByRole('heading', { name: 'Pikachu' })).toBeVisible();
    await expect(page.getByText(/Base Stat/i).first()).toBeVisible();
  });
});
