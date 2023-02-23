import { useControls } from "leva";
import { useRouter } from "next/router";
import { useItems } from "../lib/items/queries";
import { useQuests } from "../lib/quests/queries";

const defaultPos = { x: 0, y: 0, z: 0 };

export function useLeva() {
  const { data: quests } = useQuests();
  const { data: items } = useItems();
  const router = useRouter();
  const data = useControls(
    {
      quest: {
        options: quests?.map((quest) => quest.name) ?? [],

        onChange: (value) => {
          router.replace({
            query: {
              questId: quests?.find((quest) => quest.name === value)?.id,
            },
          });
        },
      },
      name: "Leva",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    [quests, items]
  );
  return null;
}
