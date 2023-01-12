import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Games } from "./types";

export function useGames() {
  const { data, error } = useSWR<Games[], AxiosError>(`/api/games`, fetcher);
  return {
    data: data ?? ([] as Games[]),
    isLoading: !data && !error,
    isError: error,
  };
}

export async function createGame(game: Games) {
  await axios.post("/api/games", game);
}
