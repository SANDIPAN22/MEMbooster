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
      return res
        .status(403)
        .send("Authentication is failed. I don't know you.")
        .end();
    }
    if (!user?.verified) {
      return res
        .status(401)
        .send("Login is failed. Please verify the email first!")
        .end();
    }
    if (!(await user?.validatePassword(password))) {
      return res
        .status(403)
        .send("Authentication is failed. I don't know you.")
        .end();
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
        res.cookie("refresh_token", refresh_token, {
          maxAge: 1000 * 60 * 10000,
          httpOnly: true,
          sameSite: "none",
        });
        return res.status(200).json({ access_token });
      }
    }
  } catch (e) {
    console.error("error while creating the session::", e);
    return res.status(500).send("Internal server error.");
  }
};

export const RefreshAccessTokenController = async (
  req: Request,
  res: Response,
) => {
  const RT = req.cookies.refresh_token || "";
  //Decode the RT and get the id
  if (!RT) {
    console.log("Refresh token MISSING");
    res.status(403).send("Forbidden-no-RT").end();
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

      const user = await UserModel.findById(id);

      if (!user) {
        console.log("Refresh token's user is no longer with us");
        res.status(403).send("Forbidden-no-user").end();
        return;
      }
      if (!user?.verified) {
        console.log("Refresh token's user is not email verified");
        res.status(403).send("Forbidden-not-email-verified").end();
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
    res.status(403).send("Forbidden-other-error").end();
    return;
  }

  res.send(200);
};

export const LogoutController = (req: Request, res: Response) => {
  res.clearCookie("refresh_token", { httpOnly: true });
  res.send(200);
};
