import { test, expect } from '@playwright/test';

test('landing page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText("Realtor's AI Marketing Kit")).toBeVisible();
});

