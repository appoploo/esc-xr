import { Euler, Vector3 } from "three";
type Expand = {
  collectionId: string;
  collectionName: string;
  id: string;
  model: string;
  file: string;
};

export type Item = {
  id?: string;
  name?: string;
  position?: Vector3;
  rotation?: Euler;
  src?: string;
  thumbnail?: string;
  expand: {
    model: Expand;
    thumbnail: Expand;
  };
};
