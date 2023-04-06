export type Arr3 = [number, number, number];

type Expand = {
  collectionId: string;
  collectionName: string;
  id: string;
  model: string;
  file: string;
  image: string;
};

export type Item = {
  id: string;
  name: string;
  position: Arr3;
  rotation: Arr3;
  needsClick?: boolean;
  src: string;
  type: string;
  thumbnail: string;
  scale: number;
  collectable: boolean;
  required: string[];
  expand: {
    model: Expand;
    thumbnail: Expand;
  };
};
