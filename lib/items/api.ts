import { NextApiRequest, NextApiResponse } from "next";
import { getPocketBase } from "../pocketBase";
import { Item } from "./types";

export async function getItems(req: NextApiRequest, res: NextApiResponse) {
  const pb = await getPocketBase();
  const records = await pb
    .collection("items")
    .getFullList<Item>(200 /* batch size */, {
      sort: "-created",
      expand: "model",
      filter: `quest="${req.query.quest}"`,
    });
  const data = records.map((record) => {
    return {
      ...record,
      src: `${process.env.PB_URL}/api/files/${record.expand.model?.collectionId}/${record.expand.model?.id}/${record.expand.model?.file}`,
    };
  });

  res.status(200).json(data);
}

export async function updateItem(req: NextApiRequest, res: NextApiResponse) {
  const pb = await getPocketBase();
  const id = `${req.query.id}`;
  const records = await pb.collection("items").update(id, req.body);

  res.status(200).json(records);
}

export async function getItem(req: NextApiRequest, res: NextApiResponse) {
  const pb = await getPocketBase();
  const record = await pb.collection("items").getOne(`${req.query.id}`);

  res.status(200).json(record);
}
