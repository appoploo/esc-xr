import { NextApiRequest, NextApiResponse } from "next";
import { addItemToInventory, getInventory } from "../../../lib/inventory/api";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute((req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getInventory(req, res);

    case "POST":
      return addItemToInventory(req, res);

    default:
      res.status(405).send("Method not allowed");
  }
});
