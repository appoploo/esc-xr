import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Games } from "./types";

export function useGames(
  name?: string | undefined,
  latitude?: number | undefined,
  longitude?: number | undefined,
  type?: "detect" | "collect" | undefined
) {
  const { data, error } = useSWR<Games[], AxiosError>(`/api/games`, fetcher);
  return {
    data: data ?? ([] as Games[]),
    isLoading: !data && !error,
    isError: error,
  };
}
