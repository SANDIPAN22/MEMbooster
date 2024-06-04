import express from "express";
import userRouter from "./users.routes";
import sessionRouter from "./session.router";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.use("/api/user", userRouter);
router.use("/api/auth", sessionRouter);

export default router;
