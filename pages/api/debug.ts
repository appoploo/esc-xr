// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs, { readFile } from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // write the request body to a file
  const x = readFile("users.json", (err, data) => {
    console.log(data);
  });

  res.status(200).json({ name: "John Doe" });
}
