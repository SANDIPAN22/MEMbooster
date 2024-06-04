import { Request, Response } from "express";
import { CreateSessionSchemaType } from "../schemas/session.schema";
import UserModel from "../models/users.model";
import { signJwt, verifyJwt } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const logInController = async (
  req: Request<unknown, unknown, CreateSessionSchemaType>,
  res: Response,
) => {
  const { email, password } = req.body;
  // now fetch the user based on the email
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(403).send("Authentication is failed. I don't know you.").end();
    }
    if (!user?.verified) {
      res
        .status(401)
        .send(
          "Authorization is failed. I know you but you are not verified. Please verify the mail yourself first",
        )
        .end();
    }
    if (!(await user?.validatePassword(password))) {
      res.status(403).send("Authentication is failed. I don't know you.").end();
    } else {
      if (user) {
        // create access_token and refresh_token
        const access_token = signJwt(
          user.toJSON(),
          "ACCESS_TOKEN_PRIVATE_KEY",
          {
            expiresIn: "2m",
          },
        );
        const refresh_token = signJwt(
          { id: user._id },
          "REFRESH_TOKEN_PRIVATE_KEY",
          {
            expiresIn: "1y",
          },
        );
        res.status(200).json({ access_token, refresh_token });
      }
    }
  } catch (e) {
    console.error("error while creating the session::", e);
    res.status(500).send("Internal server error.");
  }
};

export const RefreshAccessTokenController = async (
  req: Request,
  res: Response,
) => {
  const RT = req.headers["x-refresh"] || "";
  //Decode the RT and get the id
  if (!RT) {
    res.status(403).send("Forbidden").end();
    return;
  }
  try {
    const decodedPayload = verifyJwt(
      RT.toString(),
      "REFRESH_TOKEN_PUBLIC_KEY",
    ) as JwtPayload;
    if (decodedPayload) {
      const { id } = decodedPayload;
      // need to call db to check to check and get the user data
      console.log("DECODED RT===>", decodedPayload);
      const user = await UserModel.findById(id);
      console.log("User is ==>", user);
      if (!user) {
        res.status(403).send("Forbidden").end();
        return;
      }
      if (!user?.verified) {
        res.status(403).send("Forbidden").end();
        return;
      }
      // got a genuine user now create a new access token using the user
      const access_token = signJwt(user.toJSON(), "ACCESS_TOKEN_PRIVATE_KEY", {
        expiresIn: "2m",
      });
      return res.status(200).json({ access_token });
    }
  } catch (e) {
    console.error("Error occurred while refreshing the token::", e);
    res.status(403).send("Forbidden").end();
    return;
  }

  res.send(200);
};
