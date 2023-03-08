import { create } from "zustand";
import { Item } from "../lib/items/types";

interface Store {
  item: Partial<Item>;
  setItem: (item: Partial<Item>) => void;
}

export const useStore = create<Store>()((set) => ({
  item: {},
  setItem: (item) => set((state) => ({ item: { ...state.item, ...item } })),
}));
