import { NextApiRequest, NextApiResponse } from "next";
import { deleteGame, updateGame } from "../../../lib/games/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PUT":
      return updateGame(req, res);
    case "DELETE":
      return deleteGame(req, res);
    default:
      return res.status(405).send("Method not allowed");
  }
}
