import { NextApiRequest, NextApiResponse } from "next";
import { updateItem } from "../../../lib/items/api";
import { withSessionRoute } from "../../../lib/withSession";

// @ts-ignore
export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateItem(req, res);
    default:
      res.status(405).send("No method allowed");
      break;
  }
}
