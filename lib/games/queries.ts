import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "../utils";
import { Game } from "./types";

export function useGames() {
  const { data, error } = useSWR<Game[], AxiosError>(`/api/games`, fetcher);
  return {
    data: data ?? ([] as Game[]),
    isLoading: !data && !error,
    isError: error,
  };
}

export async function createGame(game: Game) {
  await axios.post("/api/games", game);
}

export async function updateGame(game: Game) {
  await axios.put(`/api/games/${game._id}`, game);
}

export async function removeGame(_id: string) {
  await axios.delete(`/api/games/${_id}`);
}
