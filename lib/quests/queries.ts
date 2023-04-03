import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Quest } from "./types";

export function useQuests() {
  const router = useRouter();
  const genericParam = router.pathname === "/generic" ? "?generic=true" : "";
  const { data, error } = useSWR<Quest[], AxiosError>(
    `/api/quests${genericParam}`,
    fetcher
  );
  return {
    data: data ?? ([] as Quest[]),
    isLoading: !data && !error,
    isError: error,
  };
}

export function updateQuest(id: string, update: Partial<Quest>) {
  return axios.put(`/api/quests/${id}`, update);
}
