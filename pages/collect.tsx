import {
  Controllers,
  Hands,
  Interactive,
  useHitTest,
  XR,
  XRButton,
} from "@react-three/xr";
import { Suspense, useEffect, useRef, useState } from "react";

import { Box, useAnimations } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import axios from "axios";
import { Mesh, MeshBasicMaterial, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useItems } from "../lib/items/queries";
import { Item } from "../lib/items/types";
import { createE3, createV3 } from "../lib/leva";
import { useStore } from "../store";

const log = (e: any) => axios.post("/api/debug", { e });

function Item(props: Item) {
  const ref = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, props.src);
  const [selected, setSelected] = useState(false);

  const { actions, names } = useAnimations(gltf.animations, ref);
  const [dragging, setDragging] = useState(false);
  const store = useStore();

  useEffect(() => {
    if (!actions || !names) return;
    const name = names?.at(0);
    if (name && ["box", "default"].includes(props.type))
      actions?.[name]?.play();
  }, [actions, props.type, names]);

  const v3 = createV3(store.item.position ?? [0, 0, 0]);
  const e3 = createE3(store.item.rotation ?? [0, 0, 0]);
  const scale = new Vector3(
    store.item.scale ?? 1,
    store.item.scale ?? 1,
    store.item.scale ?? 1
  );

  useFrame((three) => {
    const ray = three.raycaster.ray;
    // change position of ref same as raycaster
    if (!ref.current) return;
    if (selected) {
      ref.current.position.copy(three.camera.position);
      ref.current.rotation.copy(three.camera.rotation);
      ref.current.translateZ(-10);
    } else if (ref.current.position.y > 0) {
      if (ref.current.position.y > 0) {
        ref.current.position.y -= 0.4;
      }
    } else {
      ref.current.lookAt(three.camera.position);
    }
  });

  return (
    <Suspense fallback={null}>
      <mesh
        ref={ref}
        scale={props.scale}
        position={props.position}
        rotation={props.rotation}
      >
        <Interactive
          onSelect={() => {
            if (!ref.current) return;
            if (props.type === "collectable") ref.current.visible = false;
            if (props.type === "default") setSelected(!selected);
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
        </Interactive>
      </mesh>
    </Suspense>
  );
}

function Reticle() {
  const gltf = useLoader(GLTFLoader, "/3d/reticle.gltf");
  const ref = useRef<Mesh>(null);

  useHitTest((hit) => {
    if (!ref.current) return;
    hit.decompose(
      ref.current.position,
      // @ts-ignore
      ref.current.rotation,
      ref.current.scale
    );
  });

  return (
    <Suspense fallback={null}>
      <primitive ref={ref} object={gltf.scene} />
    </Suspense>
  );
}

export function App() {
  const ref = useRef<Mesh>(null);
  const refMesh = useRef<MeshBasicMaterial>(null);
  const { data: items } = useItems();
  return (
    <>
      <XRButton
        className="fixed bottom-0 z-50 flex w-full justify-center"
        mode={"AR"}
        sessionInit={{
          requiredFeatures: ["hit-test"],
        }}
        onError={(error) => log(error)}
      ></XRButton>

      <Canvas className="h-screen w-screen ">
        <XR>
          <Controllers
            /** Optional material props to pass to controllers' ray indicators */
            rayMaterial={{
              color: "blue",
              visible: true,
            }}
          />
          <Hands
            // Optional custom models per hand. Default is the Oculus hand model
            modelLeft="/model-left.glb"
            modelRight="/model-right.glb"
          />
          {items?.map((item) => (
            <Item key={item.id} {...item} />
          ))}
          <Reticle />

          <ambientLight intensity={0.5} />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
