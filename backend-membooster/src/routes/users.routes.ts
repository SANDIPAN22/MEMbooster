import express from "express";
import {
  createUserController,
  verifyUserController,
  resetPasswordController,
  changePasswordController,
} from "../controllers/users.controller";
import validateRequest from "../middlewares/validateResources";
import {
  createUserSchemaObj,
  verifyUserSchemaObj,
  resetPasswordSchemaObj,
  changePasswordSchemaObj,
} from "../schemas/user.schema";

const router = express.Router();

// this middleware will make sure that request payload must obey the given schema
router.post("/", validateRequest(createUserSchemaObj), createUserController);
router.post(
  "/verify",
  validateRequest(verifyUserSchemaObj),
  verifyUserController,
);
router.post(
  "/reset_password",
  validateRequest(resetPasswordSchemaObj),
  resetPasswordController,
);
router.post(
  "/change_password",
  validateRequest(changePasswordSchemaObj),
  changePasswordController,
);

export default router;
