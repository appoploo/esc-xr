import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/router";
import { Suspense, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Settings } from "../components/Settings";
import { useGltfScene } from "../Hooks/useGltfScene";
import { useItems } from "../lib/items/queries";
import { Arr3, Item } from "../lib/items/types";
import { createE3, createV3 } from "../lib/leva";
import { useStore } from "../store";

function Item(props: Item) {
  const ref = useRef<Mesh>(null);
  const gltf = useGltfScene(props?.src ?? "");
  console.log(gltf.animations);
  const router = useRouter();
  const id = router.query?.id;
  const isSelected = id === props.id;
  const [dragging, setDragging] = useState(false);

  const store = useStore();

  const v3 = createV3(store.item.position ?? [0, 0, 0]);
  const e3 = createE3(store.item.rotation ?? [0, 0, 0]);
  const scale = new Vector3(
    store.item.scale ?? 1,
    store.item.scale ?? 1,
    store.item.scale ?? 1
  );

  // useFrame((t) => {
  //   if (!ref.current) return;
  //   if (dragging) {
  //     t.raycaster.setFromCamera(t.mouse, t.camera);
  //     const direction = t.raycaster.ray.direction;
  //     const v3 = t.camera.position
  //       .clone()
  //       .add(direction.clone().multiplyScalar(20));
  //     ref.current.position.copy(v3);
  //     ref.current.lookAt(t.camera.position);
  //   } else if (isSelected) {
  //     ref.current.position.copy(v3);
  //     ref.current.rotation.copy(e3);
  //   }
  //   ref.current.scale.copy(scale);
  // });

  return (
    <Suspense fallback={null}>
      <mesh
        ref={ref}
        onClick={() => alert("click")}
        scale={props.scale}
        position={props.position}
        rotation={props.rotation}
        onDoubleClick={() => {
          setDragging(!dragging);
          router.replace({
            query: { ...router.query, id: props.id },
          });
          const position = ref.current?.position.toArray() ?? [0, 0, 0];
          const rotation = ref.current?.rotation.toArray() ?? [0, 0, 0];
          if (dragging) {
            store.setItem({
              position,
              rotation: rotation.slice(0, 3) as Arr3,
            });
          }
        }}
      >
        <primitive object={gltf} />
      </mesh>
    </Suspense>
  );
}

export default function Page() {
  const { data: items } = useItems();
  return (
    <div className="relative h-screen w-screen">
      <Settings />
      <Canvas>
        <ambientLight intensity={3} />
        <Grid args={[200, 200]} position={[0, -5, 0]} />
        <OrbitControls />
        <Environment background preset="dawn" />
        {items?.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </Canvas>
    </div>
  );
}
