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

  const _items = items?.reduce((acc, item) => {
    acc[item?.name] = item?.id;
    return acc;
  }, {} as Record<string, any>);
  console.log(_items);
  useControls(
    {
      item: {
        label: "Item",
        options: _items,
        onChange: (value) => {
          router.push(`/editor?id=${value}&questId=${questId}`);
        },
      },
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
    [quests, items, _items, id]
  );
  return null;
}
