import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Quest } from "./types";

export function useQuests() {
  const { data, error } = useSWR<Quest[], AxiosError>(`/api/quests`, fetcher);
  return {
    data: data ?? ([] as Quest[]),
    isLoading: !data && !error,
    isError: error,
  };
}

export function updateQuest(id: string, update: Partial<Quest>) {
  return axios.put(`/api/quests/${id}`, update);
}
