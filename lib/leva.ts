import { levaStore } from "leva";
import { Euler, Vector3 } from "three";
import { Item } from "./items/types";

export type Arr3 = [number, number, number];

export const createV3 = (v: Arr3) => new Vector3(...v);
export const createE3 = (e3: Arr3) => {
  const rot = new Euler(...e3.map((e) => (e * Math.PI) / 180));
  return rot;
};
export function setToLeva(props: Item) {
  if (!props.rotation || !props.position || !props.scale) return;
  const rot = new Euler(...props.rotation.map((e) => (e * Math.PI) / 180));
  levaStore.set(
    {
      item: props.id,
      position: props.position,
      rotation: [rot.x, rot.y, rot.z],
      scale: props.scale,
    },
    true
  );
}
