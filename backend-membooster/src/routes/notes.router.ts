import express from "express";
import {
  getAllNotes,
  createNote,
  getNote,
  deleteNote,
  updateNote,
  addCollaborator,
  deleteCollaborator,
  getAllNotesAsCollaborator,
  updateNoteAsCollaborator,
  getNoteAsCollaborator,
} from "../controllers/notes.controller";
import protectedPath from "../middlewares/protected";
import validateRequest from "../middlewares/validateResources";
import {
  manageNoteCollaboratorsObj,
  noteSchemaObj,
} from "../schemas/note.schema";

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
// collaboration routes
router.put(
  "/add/collab/:noteId",
  protectedPath,
  validateRequest(manageNoteCollaboratorsObj),
  addCollaborator,
);
router.put(
  "/delete/collab/:noteId",
  protectedPath,
  validateRequest(manageNoteCollaboratorsObj),
  deleteCollaborator,
);

router.get("/my/collab", protectedPath, getAllNotesAsCollaborator);

router.put(
  "/my/collab/:noteId",
  protectedPath,
  validateRequest(noteSchemaObj),
  updateNoteAsCollaborator,
);
router.get("/my/collab/:noteId", protectedPath, getNoteAsCollaborator);
export default router;
