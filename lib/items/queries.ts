import { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Item } from "./types";

export function useItems() {
  const { data, error } = useSWR<Item[], AxiosError>(`/api/items`, fetcher);
  return {
    data: data ?? ([] as Item[]),
    isLoading: !data && !error,
    isError: error,
  };
}
