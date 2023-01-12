import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance.toFixed(0)} meters`;
  return `${(distance / 1000).toFixed(2)} km`;
};
