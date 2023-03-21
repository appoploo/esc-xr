import { NextApiRequest, NextApiResponse } from "next";
import updateQuest from "../../../lib/quests/api";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute((req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "PUT":
      return updateQuest(req, res);
    default:
      res.status(405).send("No method allowed");
      break;
  }
});
