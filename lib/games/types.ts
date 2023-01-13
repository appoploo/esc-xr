export type Game = {
  _id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  type?: "detect" | "collect";
  description?: string;
  assets?: string[];
};
