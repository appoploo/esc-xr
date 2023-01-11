export type Games = {
  name?: string;
  latitude?: number;
  longitude?: number;
  type?: "detect" | "collect";
  assets?: string[];
};
