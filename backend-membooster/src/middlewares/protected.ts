import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { JsonWebTokenError } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  const AT = (req.headers.authorization || "").replace(/^Bearer\s/, "");

  // if access token is missing then this request is forbidden
  if (!AT) {
    console.log("AT missing !!!!");
    return res.status(401).send("Unauthorized").end();
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
      console.log("AT Expired....");
      res.status(401).send("Access Token is expired").end();
      return;
    }
    console.log("forbidden to access protected API for any reason.");
    res.status(403).send("Forbidden").end();
    return;
  }
};
