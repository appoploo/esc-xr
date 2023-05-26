import { Interactive, XR } from "@react-three/xr";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { Box, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { Mesh, Sprite } from "three";
import { SkeletonUtils } from "three-stdlib";
import { useInventory } from "../../lib/inventory/queries";
import { useItems } from "../../lib/items/queries";
import { Item } from "../../lib/items/types";
import { useQuests } from "../../lib/quests/queries";
import { accessLevel, withSessionSsr } from "../../lib/withSession";
import { Sphere } from "../sphere";

// You must extend with the objects you're going to use in the scene.
extend({ Sprite });

// same url multiple GLTF instances
function useGltfMemo(url: string) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  return { ...gltf, animations: [...gltf.animations], scene: scene };
}

function Item(
  props: Item & {
    selected?: boolean;
  }
) {
  const ref = useRef<Mesh>(null);
  const gltf = useGltfMemo(props.src);
  const { actions, names } = useAnimations(gltf.animations, ref);

  useEffect(() => {
    if (!actions || !names) return;
    const name = names?.at(0);
    if (name) {
      const animation = actions?.[name]?.play();
      animation?.setLoop(1, 1);
      animation?.halt(2.25);
    }
  }, [actions, names]);

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
      <Interactive
        onSelect={() => {
          if (props.type === "box") return;
          const name = names?.at(0);
          if (name) {
            const animation = actions?.[name]?.play();
            animation?.setLoop(1, 1);
            if (!animation) return;
            actions?.[name]?.reset();
          }
        }}
      >
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
      </Interactive>
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
  const { data: inventory } = useInventory();

  const allInsideTheBox =
    inTheBox.length > 0 &&
    items?.filter((i) => i.type === "draggable").length === inTheBox.length;

  const doIHaveAchievement = inventory.find(
    (i) => i.quest_id === activeQuest?.id && i.type === "achievement"
  );

  useEffect(() => {
    if (!allInsideTheBox || doIHaveAchievement) return;
    console.log("allInsideTheBox", allInsideTheBox);
    mutate({
      quest_id: `${router.query.quest}`,
      type: "achievement",
    }).then(() =>
      toast.success(`${activeQuest?.infobox}`, {
        autoClose: false,
        closeOnClick: true,
      })
    );
  }, [allInsideTheBox, doIHaveAchievement, activeQuest?.infobox]);
  return (
    <Canvas className="h-screen w-screen ">
      <XR>
        {activeQuest?.sphere && <Sphere sphere={activeQuest?.sphere} />}

        {items
          ?.filter((m) => m.type === "box")
          ?.map((item) => {
            const insideTheBox = inTheBox.length;
            const src =
              insideTheBox > 0 ? item.models?.at(insideTheBox - 1) : item.src;
            return (
              <group key={item.id}>
                <ambientLight intensity={1} />
                <Interactive
                  onSelect={(t) => {
                    if (selected) setInTheBox([...inTheBox, selected]);
                    setSelected(null);
                  }}
                >
                  <Item {...item} src={src!} key={src} />
                </Interactive>
              </group>
            );
          })}
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
