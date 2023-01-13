export type Game = {
  _id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  type?: "detect" | "collect";
  assets?: string[];
};
