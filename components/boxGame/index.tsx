import { Interactive, XR } from "@react-three/xr";
import { Suspense, useEffect, useRef, useState } from "react";

import { Box, useAnimations } from "@react-three/drei";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Mesh, Sprite } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useItems } from "../../lib/items/queries";
import { Item } from "../../lib/items/types";
import { useQuests } from "../../lib/quests/queries";
import { accessLevel, withSessionSsr } from "../../lib/withSession";
import { Sphere } from "../sphere";

// You must extend with the objects you're going to use in the scene.
extend({ Sprite });

function Item(
  props: Item & {
    selected?: boolean;
  }
) {
  const ref = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, props.src);
  const { actions, names } = useAnimations(gltf.animations, ref);

  useEffect(() => {
    if (!actions || !names) return;
    const name = names?.at(0);
    if (name && ["box", "default"].includes(props.type))
      actions?.[name]?.play();
  }, [actions, props.type, names]);

  useFrame((three) => {
    const ray = three.raycaster.ray;
    // change position of ref same as raycaster
    if (!ref.current) return;
    if (props.selected) {
      ref.current.position.copy(three.camera.position);
      ref.current.rotation.copy(three.camera.rotation);
      ref.current.translateZ(-10);
    } else if (ref.current.position.y > 0) {
      if (ref.current.position.y > 0) {
        ref.current.position.y -= 0.4;
      }
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
        <pointLight intensity={0.5} />

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

export function BoxGame() {
  const { data: items } = useItems();

  const [inTheBox, setInTheBox] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { data: quests } = useQuests();
  const activeQuest = quests?.find((q) => q.id === `${router.query.quest}`);
  return (
    <Canvas className="h-screen w-screen ">
      <XR>
        {activeQuest?.sphere && <Sphere sphere={activeQuest?.sphere} />}

        {items
          ?.filter((m) => m.type === "box")
          ?.map((item) => (
            <group key={item.id}>
              <ambientLight intensity={1} />
              <Interactive
                onSelect={(t) => {
                  if (selected) setInTheBox([...inTheBox, selected]);
                }}
              >
                <Item {...item} />
              </Interactive>
            </group>
          ))}
        {items
          ?.filter((mesh) => {
            if (mesh.type === "box") return null;
            if (inTheBox.includes(mesh.id)) return null;
            return true;
          })
          ?.map((item) => (
            <Interactive
              onSelect={() => {
                if (item.type !== "draggable") return;
                setSelected(item.id === selected ? null : item.id);
              }}
              key={item.id}
            >
              <Item selected={item.id === selected} {...item} />
            </Interactive>
          ))}

        <ambientLight intensity={0.5} />
      </XR>
    </Canvas>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
