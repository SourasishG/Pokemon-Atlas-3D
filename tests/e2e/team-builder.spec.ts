import { test, expect } from '@playwright/test';

test.describe('Team Builder E2E Journey', () => {
  test('user adds Pokémon to team and verifies team stats', async ({ page }) => {
    await page.goto('/explorer');

    // Find and click 'Add to Team' button on first card
    const teamBtn = page.getByTitle('Add to Team').first();
    await teamBtn.click();

    // Navigate to Team Builder page
    await page.click('text=Team Studio');
    await expect(page).toHaveURL(/\/team/);

    // Verify team count updated
    await expect(page.getByText(/Team Members \(1\/6\)/i)).toBeVisible();
  });
});
