import jwt from "jsonwebtoken";
import { KEYS } from "../config";
import { omit } from "lodash";

export const privateFields = [
  "password",
  "__v",
  "verificationCode",
  "passwordResetCode",
  "verified",
];

export const signJwt = (
  payload: object,
  keyType: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
  options: object,
): string => {
  const signingKey = Buffer.from(KEYS[keyType], "base64").toString("ascii");

  const filteredPayload = omit(payload, privateFields);
  return jwt.sign(filteredPayload, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = (
  token: string,
  keyType: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY",
) => {
  const verifyingKey = Buffer.from(KEYS[keyType], "base64").toString("ascii");

  const extractedPayload = jwt.verify(token, verifyingKey);
  return extractedPayload;
};
