import {
  Box,
  Environment,
  Grid,
  OrbitControls,
  useAnimations,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Suspense, useEffect, useRef, useState } from "react";
import { BackSide, Mesh, Vector3 } from "three";
import { GLTFLoader } from "three-stdlib";
import { Settings } from "../components/Settings";
import { useItems } from "../lib/items/queries";
import { Arr3, Item } from "../lib/items/types";
import { createE3, createV3 } from "../lib/leva";
import { accessLevel, withSessionSsr } from "../lib/withSession";
import { useStore } from "../store";

function Item(props: Item) {
  const ref = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, props.src);
  // const gltf = useGltfScene(props?.src ?? "");

  const { actions, names } = useAnimations(gltf.animations, ref);
  const router = useRouter();
  const id = router.query?.id;
  const isSelected = id === props.id;
  const [dragging, setDragging] = useState(false);
  const store = useStore();

  useEffect(() => {
    if (!actions || !names) return;
    const name = names?.at(0);
    if (name) actions?.[name]?.play();
  }, [actions, names]);

  const v3 = createV3(store.item.position ?? [0, 0, 0]);
  const e3 = createE3(store.item.rotation ?? [0, 0, 0]);
  const scale = new Vector3(
    store.item.scale ?? 1,
    store.item.scale ?? 1,
    store.item.scale ?? 1
  );

  useFrame((t) => {
    if (!ref.current) return;
    if (dragging) {
      t.raycaster.setFromCamera(t.mouse, t.camera);
      const direction = t.raycaster.ray.direction;
      const v3 = t.camera.position
        .clone()
        .add(direction.clone().multiplyScalar(20));
      ref.current.position.copy(v3);
      ref.current.lookAt(t.camera.position);
    } else if (isSelected) {
      ref.current.position.copy(v3);
      ref.current.rotation.copy(e3);
      ref.current.scale.copy(scale);
    }
  });
  return (
    <Suspense fallback={null}>
      <mesh
        ref={ref}
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
        <Box position={[0, 0.7, 0]} args={[1.5, 1.5, 1.5]}>
          {/* make it invisible */}
          <meshBasicMaterial
            visible={false}
            attach="material"
            transparent
            opacity={0}
          />
        </Box>
        <primitive object={gltf.scene} />
      </mesh>
    </Suspense>
  );
}

function Sphere(props: any) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.z += 0.001;
  });
  const texture = useTexture("/textures/aplha3.jpg");
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[60, 32 * 6, 32 * 6]} />
      <meshStandardMaterial
        side={BackSide}
        map={texture}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function Page() {
  const { data: items } = useItems();
  return (
    <div className="relative h-screen w-screen">
      <Settings />
      <Canvas>
        <ambientLight intensity={3} />
        <axesHelper position={[0, -4.95, 0]} args={[60]} />
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

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("admin", ctx);
  }
);
