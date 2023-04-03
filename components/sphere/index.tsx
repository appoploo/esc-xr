import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BackSide, Mesh } from "three";

export function Sphere(props: { sphere?: string }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.z += 0.001;
  });
  const texture = useTexture(props?.sphere ?? "/textures/aplha3.jpg");
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[60, 32 * 6, 32 * 6]} />
      <meshStandardMaterial
        side={BackSide}
        map={texture}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
