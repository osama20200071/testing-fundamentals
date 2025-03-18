import { test, expect, Page } from '@playwright/test';

test('has title', async ({ page }) => {
  // await page.goto('http://localhost:5173/clustering');
  // await expect(page).toHaveTitle('Chicago Traffic Accidents Clustering');

  const clusterPage = new ClusterPage(page);
  await clusterPage.goto({});
  await expect(clusterPage.title).resolves.toBe(
    'Chicago Traffic Accidents Clustering'
  );
  // expect(await clusterPage.title).toBe('Chicago Traffic Accidents Clustering');
});

test('it prints the current Parameters', async ({ page }) => {
  // await page.goto(
  //   'http://localhost:5173/clustering/?size=5000&distance=100&minClusterSize=10'
  // );
  // await expect(page.locator('span.size')).toHaveText('5000');
  // await expect(page.locator('span.distance')).toHaveText('100');
  // await expect(page.locator('span.min-cluster-size')).toHaveText('10');

  const clusterPage = new ClusterPage(page);
  await clusterPage.goto({ distance: 100, minClusterSize: 10, size: 5000 });
  await expect(clusterPage.size).toHaveText('5000');
  await expect(clusterPage.distance).toHaveText('100');
  await expect(clusterPage.minClusterSize).toHaveText('10');
});

test('it should print validation error when out of bound Parameters are passed', async ({
  page,
}) => {
  const clusterPage = new ClusterPage(page);
  await clusterPage.goto({});
  await clusterPage.setDistance(1);
  await clusterPage.submit();
  await expect(clusterPage.distanceError).toHaveText(
    'Distance must be at least 100'
  );
});

type GotoPrams = {
  distance?: number;
  size?: number;
  minClusterSize?: number;
};

class ClusterPage {
  constructor(private page: Page) {}

  goto({ distance, minClusterSize, size }: GotoPrams) {
    const url = new URL('http://localhost:5173/clustering');
    if (distance) url.searchParams.set('distance', distance.toString());
    if (size) url.searchParams.set('size', size.toString());
    if (minClusterSize)
      url.searchParams.set('minClusterSize', minClusterSize.toString());

    return this.page.goto(url.toString());
  }

  get title() {
    return this.page.title();
  }

  get distance() {
    return this.page.locator('span.distance');
  }
  async setDistance(distance: number) {
    // filling this selected element with specific value
    await this.page.fill('input[name=distance]', distance.toString());
  }

  get size() {
    return this.page.locator('span.size');
  }

  get minClusterSize() {
    return this.page.locator('span.min-cluster-size');
  }

  submit() {
    return this.page.click('[type=submit]');
  }

  get distanceError() {
    return this.page.locator('.error.distance');
  }
}
