import {
  Environment,
  Grid,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Mesh } from "three";
import { useGltfScene } from "../Hooks/useGltfScene";
import { useLeva } from "../Hooks/useLeva";
import { useItems } from "../lib/items/queries";
import { Item } from "../lib/items/types";

function Item(props: Item) {
  const ref = useRef<Mesh>(null);
  const gltf = useGltfScene(props?.src ?? "");

  const router = useRouter();
  return (
    // <Suspense fallback={null}>
    <TransformControls
      key={props.id}
      dispatchEvent={(e) => {}}
      onChange={() => {
        console.log(ref.current?.uuid);
        // console.log(ref.current?.position);
        // if (!ref.current) return;
        // console.log(ref.current?.parent?.position);
        // router.replace({
        //   query: {
        //     ...router.query,
        //     id: props.id,
        //   },
        // });
      }}
      position={props.position}
    >
      <mesh ref={ref} scale={[20, 20, 20]}>
        <primitive object={gltf} />
      </mesh>
    </TransformControls>
    // </Suspense>
  );
}

export default function Page() {
  const { data: items } = useItems();
  useLeva();
  return (
    <Canvas>
      <Grid args={[200, 200]} position={[0, -5, 0]} />
      <OrbitControls makeDefault maxDistance={5e-10} />
      <Environment background preset="dawn" />
      {items?.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </Canvas>
  );
}
