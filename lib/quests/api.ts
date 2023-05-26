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
      filter: `generic=${req.query.generic ? "true" : "false"}`,
    });

  res.status(200).json(
    records.map((record) => ({
      ...record,
      sphere: record.sphere
        ? `${process.env.PB_URL}/api/files/${record?.collectionId}/${record?.id}/${record.sphere}`
        : undefined,
    }))
  );
}

export default async function updateQuest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pb = await getPocketBase();
  const record = await pb
    .collection("quests")
    .update(`${req.query.id}`, req.body);

  res.status(200).json(record);
}
