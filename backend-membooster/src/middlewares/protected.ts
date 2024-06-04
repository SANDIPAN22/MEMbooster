import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { JsonWebTokenError } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  const AT = (req.headers.authorization || "").replace(/^Bearer\s/, "");

  // if access token is missing then this request is forbidden
  if (!AT) {
    return res.status(403).send("Forbidden").end();
  }
  try {
    const decodedPayload = verifyJwt(AT, "ACCESS_TOKEN_PUBLIC_KEY");
    if (decodedPayload !== null) {
      res.locals.user = decodedPayload;
      next();
    }
  } catch (e) {
    if (
      e instanceof JsonWebTokenError &&
      e.name &&
      e.name === "TokenExpiredError"
    ) {
      res.status(410).send("Access Token is expired").end();
      return;
    }
    res.status(403).send("Forbidden").end();
    return;
  }
};
