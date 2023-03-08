import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Item } from "./types";

export function useItems() {
  const router = useRouter();
  const quest = router.query.quest;
  const { data, error } = useSWR<Item[], AxiosError>(
    `/api/items?quest=${quest}`,
    fetcher
  );
  return {
    data: data ?? ([] as Item[]),
    isLoading: !data && !error,
    isError: error,
  };
}

export function useItem() {
  const router = useRouter();
  const id = router.query.id;
  const { data, error } = useSWR<Item, AxiosError>(`/api/items/${id}`, fetcher);
  return {
    data: data,
    isLoading: !data && !error,
    isError: error,
  };
}

export function updateItem(item: Partial<Item>) {
  return axios.put(`/api/items/${item.id}`, item);
}
