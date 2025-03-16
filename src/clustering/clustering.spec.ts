import { describe, it } from 'vitest';
import { cluster, loadDataset, Location } from './clustering';

describe('clustering', () => {
  it('should load the data set', ({ expect }) => {
    const data = loadDataset();
    expect(data).toMatchSnapshot();
  });

  it('should create cluster', ({ expect }) => {
    const dataset: Location[] = [
      { lat: 0, lng: 0 },
      { lat: 1, lng: 1 },
      { lat: 10, lng: 10 },
      { lat: 11, lng: 11 },
    ];

    const clusters = cluster(dataset, 5, 1);
    // to make sure that the results must contain those properties
    // it could have more but we check that those exists
    expect(clusters).toMatchObject({
      latMin: 0,
      latMax: 11,
      lngMin: 0,
      lngMax: 11,
      clusters: [
        {
          // first cluster
          data: [
            { lat: 0, lng: 0 },
            { lat: 1, lng: 1 },
          ],
        },
        {
          // second cluster
          data: [
            { lat: 10, lng: 10 },
            { lat: 11, lng: 11 },
          ],
        },
      ],
    });
  });
});
