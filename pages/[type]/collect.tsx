import {
  Controllers,
  Hands,
  Interactive,
  useHitTest,
  useXR,
  XR,
  XRButton,
} from "@react-three/xr";
import { Suspense, useEffect, useRef, useState } from "react";

import { Box, useAnimations } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useMutation from "../../Hooks/useMutation";
import { addItemToInventory, useInventory } from "../../lib/inventory/queries";
import { useItems } from "../../lib/items/queries";
import { Item } from "../../lib/items/types";
import { useQuests } from "../../lib/quests/queries";
import { accessLevel, withSessionSsr } from "../../lib/withSession";
import { useStore } from "../../store";

function Item(props: Item) {
  const [mutate] = useMutation(addItemToInventory, ["/api/inventory"]);
  const ref = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, props.src);
  const [selected, setSelected] = useState(false);
  const { actions, names } = useAnimations(gltf.animations, ref);
  const store = useStore();

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
    if (selected) {
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
        <Interactive
          onSelect={() => {
            mutate({
              name: props.name,
              item_id: props.id,
              type: "item",
            });
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

function Reward(props: { infoBox?: string; giveReward: boolean }) {
  const xr = useXR();
  const router = useRouter();

  const [mutate] = useMutation(addItemToInventory, ["/api/inventory"]);

  useEffect(() => {
    if (!props.giveReward) return;
    xr.session?.end().then(() => {
      mutate({
        quest_id: `${router.query.quest}`,
        type: "achievement",
      })
        .then(() => router.push("/insitu"))
        .then(() =>
          toast.info(props.infoBox, {
            autoClose: false,
            closeOnClick: true,
          })
        );
    });
  }, [props.giveReward, props.infoBox, xr.session, router, mutate]);
  return null;
}

export function App() {
  const { data: items } = useItems();
  const { data: inventory } = useInventory();
  const itemsIDidntCollect = items?.filter(
    (item) => !inventory?.find((i) => i.item_id === item.id)
  );
  const router = useRouter();
  const { data: quests } = useQuests();
  const activeQuest = quests?.find((q) => q.id === `${router.query.quest}`);
  return (
    <>
      <div className="fixed bottom-0 z-50   grid h-fit w-screen  p-4">
        <XRButton
          className="flex h-14 w-full items-center justify-center  border border-gray-700  bg-black  bg-opacity-70 text-lg font-bold text-white"
          mode={"AR"}
          sessionInit={{
            requiredFeatures: ["hit-test"],
          }}
        ></XRButton>
      </div>

      <Canvas className="h-screen w-screen ">
        <XR>
          <ambientLight intensity={2} />
          <directionalLight position={[0, 10, 0]} />
          {/* {activeQuest?.sphere && <Sphere sphere={activeQuest?.sphere} />} */}
          <Reward
            infoBox={activeQuest?.infobox}
            giveReward={itemsIDidntCollect.length === 0}
          />
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
          {itemsIDidntCollect?.map((item) => (
            <Item key={item.id} {...item} />
          ))}
          <Reticle />
          <ambientLight intensity={0.5} />
        </XR>
      </Canvas>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);

export default App;
