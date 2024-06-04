import express from "express";
import {
  getAllNotes,
  createNote,
  getNote,
  deleteNote,
  updateNote,
} from "../controllers/notes.controller";
import protectedPath from "../middlewares/protected";
import validateRequest from "../middlewares/validateResources";
import { noteSchemaObj } from "../schemas/note.schema";

const router = express.Router();

router.get("/", protectedPath, getAllNotes);
router.post("/", protectedPath, validateRequest(noteSchemaObj), createNote);
router.get("/:noteId", protectedPath, getNote);
router.delete("/:noteId", protectedPath, deleteNote);
router.put(
  "/:noteId",
  protectedPath,
  validateRequest(noteSchemaObj),
  updateNote,
);

export default router;
