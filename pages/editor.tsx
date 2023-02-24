import {
  Environment,
  Grid,
  OrbitControls,
  PivotControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { levaStore } from "leva";
import { useRouter } from "next/router";
import { Suspense, useRef } from "react";
import { Euler, Group, Matrix4, Mesh, Quaternion, Vector3 } from "three";
import { LevaSettings } from "../components/leva";
import { useGltfScene } from "../Hooks/useGltfScene";
import { useItems } from "../lib/items/queries";
import { Item } from "../lib/items/types";
import { Arr3 } from "../lib/leva";

function Item(props: Item) {
  const ref = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const gltf = useGltfScene(props?.src ?? "");

  const matrix = new Matrix4();

  useFrame(() => {
    if (!ref.current) return;
    const pos = levaStore.get("position") as Arr3;
    const rot = (levaStore.get("rotation") as Arr3).map(
      (e) => e * (Math.PI / 180)
    );
    const v3 = new Vector3(pos[0], pos[1], pos[2]);
    const e3 = new Euler(rot[0], rot[1], rot[2]);
    const q = new Quaternion();
    q.setFromEuler(e3);
    matrix.compose(v3, q, new Vector3(1, 1, 1));
  });

  const router = useRouter();
  return (
    <Suspense fallback={null}>
      <PivotControls
        ref={groupRef}
        annotations
        autoTransform={false}
        matrix={matrix}
        onDrag={(e) => {
          matrix.copy(e);
          const v3 = new Vector3();
          const rotation = new Quaternion();
          const e3 = new Euler();
          const scale = new Vector3();
          e.decompose(v3, rotation, scale);
          const rot = e3.setFromQuaternion(rotation);
          levaStore.set(
            {
              position: [v3.x, v3.y, v3.z],
              rotation: [rot.x, rot.y, rot.z].map((r) => r * (180 / Math.PI)),
            },
            true
          );
        }}
        // onChange={(e) => {
        //   if (!e?.target?.dragging) return;
        //   const pos = e?.target?.object?.position;
        //   if (pos) levaStore.set({ position: [pos.x, pos.y, pos.z] }, true);
        // }}
        // position={props.position}
        anchor={[0, 0, 0]}
      >
        <mesh
          ref={ref}
          onClick={() => {
            // levaStore.set({ position: props.position }, false);
          }}
          // ref={meshRef}
        >
          <primitive object={gltf} />
        </mesh>
      </PivotControls>
    </Suspense>
  );
}

export default function Page() {
  const { data: items } = useItems();
  // useLeva();
  return (
    <>
      <Canvas>
        <ambientLight intensity={3} />
        <Grid args={[200, 200]} position={[0, -5, 0]} />
        <OrbitControls maxDistance={5e-10} makeDefault />
        <Environment background preset="dawn" />
        {items?.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </Canvas>
      <LevaSettings />
    </>
  );
}
