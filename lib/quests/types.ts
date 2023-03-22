export type Quest = {
  id?: string;
  collectionId: string;
  collectionName: string;
  name?: string;
  lat?: number;
  lng?: number;
  type?: "detect" | "collect" | "none";
  description?: string;
  radius?: number;
  detect?: string[];
  detect_label?: string;
  image?: string;
  expand: any;
};
