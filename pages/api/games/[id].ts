import { NextApiRequest, NextApiResponse } from "next";
import { deleteGame, updateGame } from "../../../lib/games/api";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log("api handler");
  // switch (req.method) {
  //   // case "PUT":
  //   //   updateGame(req, res);
  //   // case "DELETE":
  //   //   console.log("------");
  //   //   console.log(req.query.id);
  //   //   console.log("------");

  //   //   deleteGame(req, res);
  //   default:
  //     res.status(405).send("Method not allowed");
  // }
  res.status(200).json(req.query.id);
}
