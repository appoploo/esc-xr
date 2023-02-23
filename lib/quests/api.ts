import { NextApiRequest, NextApiResponse } from "next";
import { getPocketBase } from "../pocketBase";
import { Quest } from "./types";

export async function getQuests(req: NextApiRequest, res: NextApiResponse) {
  const pb = await getPocketBase();
  const records = await pb
    .collection("quests")
    .getFullList<Quest>(200 /* batch size */, {
      sort: "-created",
      expand: "model",
    });

  res.status(200).json(records);
}
