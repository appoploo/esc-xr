import React, { Suspense, useRef, useState } from "react";
import { XR, XRButton, useHitTest } from "@react-three/xr";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Box, useFBX } from "@react-three/drei";

function Reticle({ color, size, scale, children, ...rest }: any) {
  const ref = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, "/3d/reticle.gltf");
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
  const ref = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState(-1);
  return (
    <>
      <h1>asdas</h1>
      <XRButton
        className="fixed z-50 bottom-0 w-full flex justify-center"
        mode={"AR"}
        sessionInit={{
          requiredFeatures: ["local-floor", "hit-test"],
        }}
        onError={(error) => console.log(error)}
      ></XRButton>

      <Canvas ref={ref} className="h-screen w-screen border">
        <XR>
          <Reticle />
          <ambientLight intensity={0.5} />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
