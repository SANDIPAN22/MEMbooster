import express from "express";
import userRouter from "./users.routes";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.use("/api/user", userRouter);

export default router;
