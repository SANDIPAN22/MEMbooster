import express from "express";
import {
  logInController,
  RefreshAccessTokenController,
  LogoutController,
} from "../controllers/session.controller";
import validateRequest from "../middlewares/validateResources";
import { createSessionSchemaObj } from "../schemas/session.schema";

const router = express.Router();

router.post("/login", validateRequest(createSessionSchemaObj), logInController);
router.post("/refresh_access_token", RefreshAccessTokenController);
router.post("/logout", LogoutController);

export default router;
