import { NextApiRequest, NextApiResponse } from "next";
import { createNewGame, getGame, getGames } from "../../../lib/games/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getGames(req, res);

    case "POST":
      return createNewGame(req, res);
    default:
      res.status(405).send("Method not allowed");
  }
}
