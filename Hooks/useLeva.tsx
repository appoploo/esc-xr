import { button, useControls } from "leva";
import { useRouter } from "next/router";
import { updateItem, useItems } from "../lib/items/queries";
import { useQuests } from "../lib/quests/queries";
import useMutation from "./useMutation";

export function useLeva() {
  const [save] = useMutation(updateItem, ["/api/items"]);
  const { data: quests } = useQuests();
  const { data: items } = useItems();
  const router = useRouter();
  const { id, questId } = router.query;

  useControls(
    {
      name: "Leva",
      position: [0, 0, 0],
      rotation: [0, 0, 0],

      save: button((get) => {
        const name = get("name");
        const position = get("position");
        const rotation = get("rotation");

        save({
          id: id?.toString(),
          name,
          position,
          rotation,
        });
      }),
    },
    [quests, items, id]
  );
  return null;
}
