import { Request, Response } from "express";
import { CreateUserSchemaType } from "../schemas/user.schema";
import UserModel from "../models/users.model";
import { sendVerificationCode } from "../utils/mailSender";

export const createUserController = async (
  req: Request<unknown, unknown, CreateUserSchemaType>,
  res: Response,
) => {
  const data = req.body;
  // as we are assured that, the data is the valid one ( Thanks to ZOD), we can go for the DB entry
  try {
    const resp = await UserModel.create(data);
    await sendVerificationCode(data.email, data.name, resp.verificationCode);
    res.status(201).send("User successfully created.");
  } catch (e: any) {
    if (e.code === 11000) {
      res.status(409).send("Um! The account is already present");
    } else {
      res.status(500).send(e);
    }
  }
};
