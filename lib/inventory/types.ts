import { Item } from "../items/types";
import { Quest } from "../quests/types";

export type inventoryItem = {
  id?: string;
  user_id?: string;
  item_id?: string;
  quest_id?: string;
  name?: string;
  src?: string;
  expand?: {
    item_id?: Item;
    quest_id?: Quest;
  };
  used?: boolean;
  type?: "item" | "achievement";
};

export type Inventory = inventoryItem[];
