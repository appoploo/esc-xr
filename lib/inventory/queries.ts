import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Inventory, inventoryItem } from "./types";

export function useInventory() {
  const { data, error } = useSWR<inventoryItem[], AxiosError>(
    `/api/inventory`,
    fetcher
  );
  return {
    data: data ?? ([] as inventoryItem[]),
    isLoading: !data && !error,
    isError: error,
  };
}

export function updateInventory(id: string, update: Partial<Inventory>) {
  return axios.put(`/api/quests/${id}`, update);
}

export function addItemToInventory(item: inventoryItem) {
  return axios.post(`/api/inventory`, item);
}
