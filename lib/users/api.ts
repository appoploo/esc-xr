import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import myDb from "../../helpers/mongo";
import { inventoryItem } from "../inventory/types";
import { getPocketBase } from "../pocketBase";
import { getErrors } from "../yupError";
const saltRounds = 10;

let schema = yup.object().shape({
  userName: yup.string().required(),
  password: yup.string().required("Password is required").min(6),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
});

export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const body = await schema.validate(req.body).catch((err) => {
    return err;
  });
  const err = getErrors(body);
  if (err) return res.status(400).json({ msg: "password_does_not_match" });
  const { password, passwordConfirmation, ...rest } = body;
  const _password = await bcrypt.hash(password, saltRounds);
  const db = await myDb();
  const alreadyExists = await db
    .collection("users")
    .findOne({ userName: body.userName });
  if (alreadyExists)
    return res.status(400).json({ msg: "username_already_exists" });

  const id = await db
    .collection("users")
    .insertOne({ ...rest, password: _password, test: true });
  await req.session.destroy();
  req.session.user = {
    id: id.insertedId.toString(),
  };
  await req.session.save();
  return res.json({});
}

let loginSchema = yup.object().shape({
  userName: yup.string().required(),
  password: yup.string().required("Password is required"),
});

export async function login(req: NextApiRequest, res: NextApiResponse) {
  const body = await loginSchema.validate(req.body).catch((err) => {
    return err;
  });

  const err = getErrors(body);
  if (err) return res.status(400).json(err);

  const db = await myDb();
  const user = await db
    .collection("users")
    .findOne({ userName: body.userName });
  if (!user) return res.status(400).json({ msg: `error` });

  const match = await bcrypt.compareSync(body?.password, user?.password);
  if (match && user?._id) {
    req.session.user = {
      admin: user?.admin,
      userName: user?.userName ?? "-",
      id: user?._id.toString(),
    };
    await req.session.save();
    const location =
      req.headers.referer?.split("/")[3] === "en" ? "/en" : "/el";

    return res.json({ admin: user?.admin, location });
  } else {
    return res.status(400).json({ msg: `error` });
  }
}

export async function logout(req: NextApiRequest, res: NextApiResponse) {
  await req.session.destroy();
  return res.writeHead(302, { Location: "/login" }).end();
}

export async function reset(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const pb = await getPocketBase();
  const inventory = await pb
    .collection("inventory")
    .getFullList<inventoryItem>(200 /* batch size */, {
      filter: `user_id = "${id}"`,
    });
  inventory.forEach(async (item) => {
    if (item?.id) await pb.collection("inventory").delete(item.id);
  });

  return res.status(200).json({
    msg: "ok",
  });
}

export async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const users = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: req.body,
    }
  );
  res.status(200).json(users);
}

export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const id = req.session.user?.id;
  const db = await myDb();
  const users = await db.collection("users").findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        _id: 1,
        time: 1,
        test: 1,
        userName: 1,
        scene: 1,
      },
    }
  );
  res.status(200).json(users);
}
