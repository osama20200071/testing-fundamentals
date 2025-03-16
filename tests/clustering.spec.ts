import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/clustering');
  await expect(page).toHaveTitle('Chicago Traffic Accidents Clustering');
});

test('it prints the current Parameters', async ({ page }) => {
  await page.goto(
    'http://localhost:5173/clustering/?size=5000&distance=100&minClusterSize=10'
  );

  await expect(page.locator('span.size')).toHaveText('5000');
  await expect(page.locator('span.distance')).toHaveText('100');
  await expect(page.locator('span.min-cluster-size')).toHaveText('10');
});
