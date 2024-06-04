// we write generic configs (which are not any thing specific) here in the index.ts

import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

export const PORT: number = parseInt(process.env.PORT || "", 10);
export const APP_ENV: string = process.env.NODE_ENV || "dev";
export const MORGAN_MODE: string = process.env.MORGAN_MODE || "dev";
export const MONGO_DB_URI: string = process.env.MONGO_DB_URI || "";
export const MAIL_SETUP: object = JSON.parse(process.env.MAIL_SETUP || "");
export const KEYS = {
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY || "",
  ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY || "",
  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY || "",
  REFRESH_TOKEN_PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY || "",
};
