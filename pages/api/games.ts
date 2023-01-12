import { NextApiRequest, NextApiResponse } from "next";

export async function createNewGame(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      createNewGame(req, res);
    default:
      res.status(405).send("Method not allowed");
  }
}
