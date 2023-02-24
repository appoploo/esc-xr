import { Arr3 } from "../leva";
type Expand = {
  collectionId: string;
  collectionName: string;
  id: string;
  model: string;
  file: string;
};

export type Item = {
  id: string;
  name: string;
  position: Arr3;
  rotation: Arr3;
  src: string;
  thumbnail: string;
  scale: number;
  expand: {
    model: Expand;
    thumbnail: Expand;
  };
};
