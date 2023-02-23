import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export const useGltfScene = (model: string) => {
  const gltf = useGLTF(model);
  const scene = useMemo(() => gltf.scene.clone(), [gltf]); // Clone the scene to be able to use multiple instances.
  return scene;
};
