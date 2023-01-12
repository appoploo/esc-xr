import { NextApiRequest, NextApiResponse } from "next";
import { updateGame } from "../../../lib/games/api";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      updateGame(req, res);
    default:
      res.status(405).send("Method not allowed");
  }
}
