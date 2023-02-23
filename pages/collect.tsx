import {
  Controllers,
  Hands,
  Interactive,
  useHitTest,
  XR,
  XRButton,
} from "@react-three/xr";
import { Suspense, useRef, useState } from "react";

import { Text } from "@react-three/drei";
import { Canvas, MeshProps, useFrame, useLoader } from "@react-three/fiber";
import axios from "axios";
import { Mesh, MeshBasicMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGltfScene } from "../Hooks/useGltfScene";

const log = (e: any) => axios.post("/api/debug", { e });

function Car(props: MeshProps) {
  const ref = useRef<Mesh>(null);
  const gltf = useGltfScene("/3d/car.gltf");
  const [selected, setSelected] = useState(false);

  useFrame((three) => {
    const ray = three.raycaster.ray;
    // change position of ref same as raycaster
    if (!ref.current) return;
    if (selected) {
      ref.current.position.copy(three.camera.position);
      ref.current.rotation.copy(three.camera.rotation);
      ref.current.translateZ(-5);
    } else if (ref.current.position.y > 0) {
      ref.current.position.y -= 0.1;
    } else {
      ref.current.rotation.x = 0;
      ref.current.rotation.z = 0;
    }
    ref.current.rotation.y += 0.01;
  });

  return (
    <Suspense fallback={null}>
      <Interactive onSelect={() => setSelected(!selected)}>
        <primitive {...props} ref={ref} object={gltf} />
      </Interactive>
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

          <Car position={[0, 5, -5]} />
          <Car position={[-2, 2, -5]} />
          <Reticle />
          <Text position={[0, 0, -10]}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error nam
            blanditiis voluptate temporibus delectus dolores vero nobis quos
            neque dolorum beatae debitis, minus aperiam magni itaque laudantium.
            Distinctio, perferendis illum.
          </Text>
          <ambientLight intensity={0.5} />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
