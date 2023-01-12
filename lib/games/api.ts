import myDb from "../../helpers/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export async function createNewGame(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const id = await db.collection("users").insertOne(req.body);
  return res.status(201).json(id);
}
