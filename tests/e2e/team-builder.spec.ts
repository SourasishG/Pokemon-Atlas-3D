import { test, expect } from '@playwright/test';

test.describe('Team Builder E2E Journey', () => {
  test('user adds Pokémon to team and verifies team stats', async ({ page }) => {
    await page.goto('/pokedex');

    // Find and click 'Add to Team' button on first card
    const teamBtn = page.getByTitle('Add to Team').first();
    await teamBtn.click();

    // Navigate to Team Builder page
    await page.getByRole('link', { name: /Team Builder/i }).first().click();
    await expect(page).toHaveURL(/\/team/);

    // Verify team members and slot count updated
    await expect(page.getByRole('button', { name: /Clear Team/i })).toBeVisible();
    await expect(page.getByText(/Slot #2/i)).toBeVisible();
  });
});
