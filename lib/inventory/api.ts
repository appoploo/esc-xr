import { NextApiRequest, NextApiResponse } from "next";
import { getPocketBase } from "../pocketBase";
import { inventoryItem } from "./types";

export async function getInventory(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  const pb = await getPocketBase();
  const records = await pb
    .collection("inventory")
    .getFullList<inventoryItem>(200 /* batch size */, {
      filter: `user_id = "${user?.id}"`,
      sort: "-created",
      expand: "item_id.model,quest_id",
    });

  const data = records.map((record) => {
    const model =
      record.type === "achievement"
        ? record?.expand?.quest_id
        : record?.expand?.item_id?.expand?.model;

    return {
      ...record,
      src: `${process.env.PB_URL}/api/files/${model?.collectionId}/${model?.id}/${model?.image}`,
    };
  });
  res.status(200).json(data);
}

export async function updateInventory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pb = await getPocketBase();
  // const record = await pb
  //   .collection("quests")
  //   .update(`${req.query.id}`, req.body);

  res.status(200).json([]);
}

export async function addItemToInventory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pb = await getPocketBase();
  const user = req.session.user;
  const record = await pb
    .collection("inventory")
    .create({ ...req.body, user_id: user?.id });

  res.status(200).json(record);
}
