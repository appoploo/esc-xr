import {
  Environment,
  Grid,
  OrbitControls,
  PivotControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/router";
import { Suspense, useRef } from "react";
import { Group, Matrix4, Mesh } from "three";
import { Settings } from "../components/Settings";
import { useGltfScene } from "../Hooks/useGltfScene";
import { useItems } from "../lib/items/queries";
import { Item } from "../lib/items/types";

function Item(props: Item) {
  const ref = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const gltf = useGltfScene(props?.src ?? "");
  const router = useRouter();
  const matrix = new Matrix4();
  const id = props?.id;

  // useFrame(() => {
  //   if (!ref.current || id !== router.query.id) return;
  //   const pos = levaStore.get("position") as Arr3;
  //   const rot = (levaStore.get("rotation") as Arr3).map(
  //     (e) => e * (Math.PI / 180)
  //   );
  //   const v3 = new Vector3(pos[0], pos[1], pos[2]);
  //   const e3 = new Euler(rot[0], rot[1], rot[2]);
  //   const q = new Quaternion();
  //   q.setFromEuler(e3);
  //   matrix.compose(v3, q, new Vector3(1, 1, 1));
  // });

  return (
    <Suspense fallback={null}>
      <PivotControls
        ref={groupRef}
        annotations
        autoTransform={false}
        matrix={matrix}
        fixed
        onDrag={(e) => {
          // matrix.copy(e);
          // const v3 = new Vector3();
          // const rotation = new Quaternion();
          // const e3 = new Euler();
          // const scale = new Vector3();
          // e.decompose(v3, rotation, scale);
          // const rot = e3.setFromQuaternion(rotation);
          // levaStore.set(
          //   {
          //     position: [v3.x, v3.y, v3.z],
          //     rotation: [rot.x, rot.y, rot.z].map((r) => r * (180 / Math.PI)),
          //   },
          //   true
          // );
        }}
        anchor={[0, 0, 0]}
      >
        <mesh ref={ref}>
          <primitive object={gltf} />
        </mesh>
      </PivotControls>
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
        <OrbitControls maxDistance={5e-10} makeDefault />
        <Environment background preset="dawn" />
        {items?.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </Canvas>
    </div>
  );
}
