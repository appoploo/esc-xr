import { NextApiRequest, NextApiResponse } from "next";
import { getPocketBase } from "../pocketBase";
import { Inventory } from "./types";

export async function getInventory(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  const pb = await getPocketBase();
  const records = await pb
    .collection("inventory")
    .getFullList<Inventory>(200 /* batch size */, {
      filter: `user_id = "${user?.id}"`,
      sort: "-created",
      expand: "model",
    });

  res.status(200).json(records);
}

export async function updateInventory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.session.user);
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
