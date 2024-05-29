import mongoose from "mongoose";
import { MONGO_DB_URI } from "../config";
export default async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    console.log("Successfully connected the DB.");
  } catch (e) {
    console.error("Failed to connect DB. Error: ", e);
    process.exit(1);
  }
};
