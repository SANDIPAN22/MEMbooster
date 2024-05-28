// we write generic configs (which are not any thing specific) here in the index.ts

import dotenv from "dotenv";
dotenv.config();

export const PORT: number = parseInt(process.env.PORT || "", 10);
export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const MORGAN_MODE: string = process.env.MORGAN_MODE || "dev";
