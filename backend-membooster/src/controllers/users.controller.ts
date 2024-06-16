import { Request, Response } from "express";
import {
  CreateUserSchemaType,
  VerifyUserSchemaType,
  ResetPasswordSchemaType,
} from "../schemas/user.schema";
import UserModel from "../models/users.model";
import {
  sendVerificationCode,
  sendPasswordResetCode,
} from "../utils/mailSender";
import { nanoid } from "nanoid";

export const createUserController = async (
  req: Request<unknown, unknown, CreateUserSchemaType>,
  res: Response,
) => {
  const data = req.body;

  // as we are assured that, the data is the valid one ( Thanks to ZOD), we can go for the DB entry
  try {
    const resp = await UserModel.create(data);
    // trigger the mail for email verification
    await sendVerificationCode(data.email, data.name, resp.verificationCode);
    res.status(201).json({ temp_id: resp._id });
  } catch (e: any) {
    if (e.code === 11000) {
      // get and check the user's email is verified, or not
      const user = await UserModel.findOne({ email: data.email });
      // if not verified then send the below error message so that user can enter the OTP
      if (!user?.verified) {
        res
          .status(409)
          .send(
            "Um! The account is already present but email is not yet verified.",
          );
        return;
      }
      //if verified then
      res.status(409).send("Um! The account is already present");
    } else {
      res.status(500).send(e);
    }
  }
};

export const verifyUserController = async (
  req: Request<unknown, unknown, VerifyUserSchemaType>,
  res: Response,
) => {
  // get the verification code and user ID

  const { userId, userOtp } = req.body;

  // call the db and match the code
  const actualUser = await UserModel.findById(userId);
  if (actualUser === null) {
    res.status(400).send("Invalid request from you.");
  } else {
    if (actualUser.verificationCode === userOtp) {
      // modify the db
      actualUser.verified = true;
      await actualUser.save();
      res.status(202).send("Account is now verified.");
    } else {
      res.status(400).send("Invalid request from you.");
    }
  }
};

export const resetPasswordController = async (
  req: Request<unknown, unknown, ResetPasswordSchemaType>,
  res: Response,
) => {
  const { emailId } = req.body;
  // first check whether this user is present or not
  const user = await UserModel.findOne({ email: emailId });
  if (user === null) {
    console.log("User with this email does not exist.");
    return res
      .send(
        "If this email is registered, you will get get a password reset OTP via email.",
      )
      .end();
  } else if (!user?.verified) {
    console.log("The user is not verified.");
    return res.status(401).send("The user is not verified.").end();
  } else {
    const PASSWORD_RESET_CODE = nanoid(8);
    user.passwordResetCode = PASSWORD_RESET_CODE;
    try {
      await user.save();
      // trigger the mail for password reset
      await sendPasswordResetCode(emailId, PASSWORD_RESET_CODE);
      res
        .send(
          "If this email is registered, you will get get a password reset OTP via email.",
        )
        .end();
    } catch (e) {
      console.error(e);
      res.status(500).send("Error occurred at server side.");
    }
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  const { emailId, otp } = req.query;
  const { newPassword } = req.body;

  try {
    const user = await UserModel.findOne({
      $and: [{ email: emailId }, { passwordResetCode: otp }],
    });

    if (!user) {
      console.log("The user is not the existing one.");
      res.status(403).send("Unable to set your password.").end();
    } else if (!user.verified) {
      console.log(" the user is not yet verified.");
      res.status(401).send("You are not yet verified.").end();
    } else {
      user.passwordResetCode = undefined;
      user.password = newPassword;
      await user.save();
      res.status(200).send("New Password is granted.");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error.");
  }
};

export const getCurrentUserController = (req: Request, res: Response) => {
  res.json(res.locals.user);
};
