import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import Cluster, { ClusterProps } from './cluster';
import { cluster } from './clustering';

export default {
  argTypes: {},
  component: Cluster,
} as Meta<ClusterProps>;

type Story = StoryObj<ClusterProps>;

const squareDataset = cluster(
  [
    { lat: 0, lng: 0 },
    { lat: 0, lng: 1 },
    { lat: 1, lng: 0 },
    { lat: 1, lng: 1 },
  ],
  10,
  2
);

// square situation
export const square: Story = {
  args: {
    dataset: squareDataset,
    height: 250,
    width: 250,
    size: 20,
  },
  render: (props) => <Cluster {...props} />,
};

const diagonalDataset = cluster(
  [
    { lat: 0, lng: 0 },
    { lat: 1, lng: 1 },
    { lat: 2, lng: 2 },
    { lat: 3, lng: 3 },
  ],
  10,
  2
);

// diagonal situation
export const diagonal: Story = {
  args: {
    dataset: diagonalDataset,
    height: 200,
    width: 200,
    size: 20,
  },
  render: (props) => <Cluster {...props} />,
};
