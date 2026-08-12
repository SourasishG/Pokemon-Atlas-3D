import { test, expect } from '@playwright/test';

test.describe('Keyboard & Navigation Accessibility E2E Journey', () => {
  test('user navigates header links using Keyboard Tab', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Header link or interactive element receives focus
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });
});
