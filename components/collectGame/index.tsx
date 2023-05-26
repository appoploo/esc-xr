import { Box, useAnimations } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Interactive, XR } from "@react-three/xr";
import { useRouter } from "next/router";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Mesh } from "three";
import { GLTFLoader } from "three-stdlib";
import useMutation from "../../Hooks/useMutation";
import { addItemToInventory, useInventory } from "../../lib/inventory/queries";
import { useItems } from "../../lib/items/queries";
import { Item } from "../../lib/items/types";
import { useQuests } from "../../lib/quests/queries";
import { useStore } from "../../store";
import { Sphere } from "../sphere";

export function GameItem(
  props: Item & {
    onClick?: () => void;
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

  useEffect(() => {
    if (!actions || !names) return;
    const name = names?.at(0);
    if (name) actions?.[name]?.play();
  }, [actions, props.type, names]);

  return (
    <Suspense fallback={null}>
      <mesh
        ref={ref}
        scale={props.scale}
        position={props.position}
        rotation={props.rotation}
      >
        <pointLight intensity={0.5} />

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

        <primitive object={gltf.scene} />
      </mesh>
    </Suspense>
  );
}

export function CollectGame() {
  const { data: games } = useQuests();
  const router = useRouter();
  const activeQuest = games?.find((g) => g.id === router.query.quest);
  const { data: items } = useItems();
  const { data: inventory } = useInventory();
  const collectables = items?.filter((item) => item.type === "collectable");
  const doIHaveAllCollectables =
    inventory.length > 0 &&
    collectables.length > 0 &&
    collectables?.every((item) =>
      inventory?.find((i) => i.item_id === item.id)
    );
  const doIHaveAchievement = inventory.find(
    (i) => i.quest_id === activeQuest?.id && i.type === "achievement"
  );
  const [mutate] = useMutation(addItemToInventory, ["/api/inventory"]);

  useEffect(() => {
    if (Boolean(doIHaveAchievement) || !doIHaveAllCollectables) return;
    mutate({
      quest_id: `${router.query.quest}`,
      type: "achievement",
    }).then(() =>
      toast.success(`${activeQuest?.infobox}`, {
        autoClose: false,
        closeOnClick: true,
      })
    );
  }, [doIHaveAllCollectables, doIHaveAchievement, activeQuest?.infobox]);

  return (
    <Canvas className="z-50 h-screen w-screen">
      <XR>
        {activeQuest?.sphere && !doIHaveAllCollectables && (
          <Sphere sphere={activeQuest?.sphere} />
        )}
        {items
          ?.filter((obj) => {
            if (obj.required.length === 0) return true;
            return obj.required.every((req) =>
              inventory?.find((i) => i.item_id === req)
            );
          })
          .filter((obj) => {
            if (inventory?.find((i) => i.item_id === obj.id)) return false;
            return true;
          })
          ?.map((item) => (
            <GameItem key={item.id} {...item} />
          ))}
        <ambientLight intensity={0.5} />
      </XR>
    </Canvas>
  );
}
