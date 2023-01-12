import myDb from "../../helpers/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export async function createNewGame(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const id = await db.collection("xrgame").insertOne(req.body);
  return res.status(201).json(id);
}

export async function updateGame(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const id = await db
    .collection("xrgame")
    .updateOne({ __id: new ObjectId(`${req.query.id}`) }, { $set: req.body });
  return res.status(201).json(id);
}

export async function getGame(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const id = await db
    .collection("xrgame")
    .findOne({ __id: new ObjectId(`${req.query.id}`) });
  return res.status(201).json(id);
}

export async function getGames(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const games = await db.collection("xrgame").find().toArray();
  return res.status(200).json(games);
}

export async function deleteGame(req: NextApiRequest, res: NextApiResponse) {
  const db = await myDb();
  const id = await db
    .collection("xrgame")
    .deleteOne({ _id: new ObjectId(`${req.query.id}`) });
  return res.status(204).send("deleted");
}
