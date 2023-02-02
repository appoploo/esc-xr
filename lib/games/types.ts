export type Game = {
  _id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  type?: "detect" | "collect" | "none";
  description?: string;
  assets?: string[];
  detected?: string;
  radius?: number;
};
