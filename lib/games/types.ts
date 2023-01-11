export type Games = {
  name: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  type: "detect" | "collect" | undefined;
  assets: string[] | undefined;
};
