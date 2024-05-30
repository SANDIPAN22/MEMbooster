import express from "express";
import { createUserController } from "../controllers/users.controller";
import validateRequest from "../middlewares/validateResources";
import { createUserSchemaObj } from "../schemas/user.schema";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ Users: [] });
});

// this middleware will make sure that request payload must obey the given schema
router.post("/", validateRequest(createUserSchemaObj), createUserController);

export default router;
