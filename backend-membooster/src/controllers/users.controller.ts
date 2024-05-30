import { Request, Response } from "express";
import { CreateUserSchemaType } from "../schemas/user.schema";
import UserModel from "../models/users.model";

export const createUserController = async (
  req: Request<unknown, unknown, CreateUserSchemaType>,
  res: Response,
) => {
  const data = req.body;
  // as we are assured that, the data is the valid one ( Thanks to ZOD), we can go for the DB entry
  try {
    await UserModel.create(data);
    res.send("Chutia");
  } catch (e: any) {
    if (e.code === 11000) {
      res.status(401).send("Um! The account is already present");
    } else {
      res.status(500).send(e);
    }
  }
};
