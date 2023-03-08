import { NextApiRequest, NextApiResponse } from "next";
import updateQuest from "../../../lib/quests/api";
import { withSessionRoute } from "../../../lib/withSession";

// @ts-ignore
export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateQuest(req, res);
    default:
      res.status(405).send("No method allowed");
      break;
  }
}
