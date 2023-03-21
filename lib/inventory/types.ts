export type inventoryItem = {
  id?: string;
  user_id?: string;
  item_id?: string;
  name?: string;
  used?: boolean;
  type?: "item" | "achievement";
};

export type Inventory = inventoryItem[];
