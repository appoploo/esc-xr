import { Controllers, Interactive, useXR, XR, XRButton } from "@react-three/xr";
import { Suspense, useEffect, useRef, useState } from "react";

import { Box, useAnimations } from "@react-three/drei";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Mesh, Sprite, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useMutation from "../../Hooks/useMutation";
import { useSpeak } from "../../Hooks/useSpeak";
import { addItemToInventory } from "../../lib/inventory/queries";
import { useItems } from "../../lib/items/queries";
import { Item } from "../../lib/items/types";
import { createE3, createV3 } from "../../lib/leva";
import { useQuests } from "../../lib/quests/queries";
import { User } from "../../lib/users/types";
import { accessLevel, withSessionSsr } from "../../lib/withSession";
import { useStore } from "../../store";
import { Sphere } from "./collect";

// You must extend with the objects you're going to use in the scene.
extend({ Sprite });

function FixedSprite() {
  useFrame(({ viewport, camera }) => {
    const fixedPosition = [
      viewport.width / 2 - 1,
      viewport.height / 2 - 1,
      -camera.position.z + 1,
    ] as [number, number, number];
    ref.current?.position.set(...fixedPosition);
  });

  // We want the sprite to be fixed in the corner of the screen, let's say top right.
  // Change these coordinates to position the sprite elsewhere.
  const ref = useRef<Sprite>(null);
  return (
    <sprite ref={ref}>
      <spriteMaterial attach="material" color="hotpink" />
    </sprite>
  );
}

function Item(
  props: Item & {
    selected?: boolean;
  }
) {
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
  const xr = useXR();
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
  const router = useRouter();
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
        .then(() => router.push(`/${router.query.type}`))
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

export default function Page(props: User) {
  const { data: items } = useItems();

  const [inTheBox, setInTheBox] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { data: quests } = useQuests();
  const activeQuest = quests?.find((q) => q.id === `${router.query.quest}`);
  const ref = useRef<HTMLInputElement>(null);
  function setModal() {
    if (!ref.current) return;
    setTimeout(() => ref.current?.click(), 2000);
  }
  const [xr, setXr] = useState(false);
  const speak = useSpeak();
  const locale = router.locale;
  return (
    <>
      <div className="fixed bottom-0 z-50  flex   h-fit w-screen  p-4">
        <button
          onClick={() => {
            speak("με τη τεχνιτη νόημοσυνη");
          }}
        >
          asdasdasd
        </button>
        <XRButton
          sessionInit={{
            domOverlay:
              typeof document !== "undefined"
                ? { root: document.body }
                : undefined,
            optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
          }}
          className={clsx(
            {
              hidden: xr,
            },
            "z-50 flex h-14 w-full items-center justify-center  border border-gray-700  bg-black  bg-opacity-70 text-lg font-bold text-white"
          )}
          mode={"AR"}
        ></XRButton>
      </div>

      <Canvas className="h-screen w-screen ">
        <XR
          onSessionStart={(evt) => {
            setXr(true);
          }}
          onSessionEnd={(evt) => {
            setXr(false);
          }}
        >
          {activeQuest?.sphere && <Sphere sphere={activeQuest?.sphere} />}

          <Reward
            infoBox={activeQuest?.infobox}
            giveReward={
              inTheBox.length > 0 && inTheBox.length === items?.length - 1
            }
          />
          <Controllers
            /** Optional material props to pass to controllers' ray indicators */
            rayMaterial={{
              color: "blue",
              visible: true,
            }}
          />

          {items
            ?.filter((m) => m.type === "box")
            ?.map((item) => (
              <group key={item.id}>
                <ambientLight intensity={1} />
                <Interactive
                  onSelect={(t) => {
                    setModal();
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
                  setModal();

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
      <div>
        <input
          ref={ref}
          type="checkbox"
          id="my-modal3"
          className="modal-toggle"
        />
        <div
          className={clsx("modal", {
            "modal-open": ref.current?.checked,
          })}
        >
          <div className="modal-box">
            <h3 className="text-lg font-bold">{activeQuest?.name}</h3>
            <div className="divider"></div>
            <p className="py-4">{activeQuest?.help}</p>
            <div className="modal-action">
              <label htmlFor="my-modal3" className="btn">
                close
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
