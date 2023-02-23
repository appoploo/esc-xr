import { NextApiRequest, NextApiResponse } from "next";
import { getQuests } from "../../../lib/quests/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getQuests(req, res);

    default:
      res.status(405).send("Method not allowed");
  }
}
