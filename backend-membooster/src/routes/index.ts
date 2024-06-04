import express from "express";
import userRouter from "./users.routes";
import sessionRouter from "./session.router";
import notesRouter from "./notes.router";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.use("/api/user", userRouter);
router.use("/api/auth", sessionRouter);
router.use("/api/note", notesRouter);

export default router;
