export type Game = {
  _id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  type?: "detect" | "collect";
  assets?: string[];
};
