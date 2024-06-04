import { Request, Response } from "express";
import NoteModel from "../models/notes.model";
import { NoteSchemaBodyType } from "../schemas/note.schema";

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    // get the current user
    const { _id } = res.locals.user || { _id: null };

    const notes = await NoteModel.find({ author: _id });

    return res.status(200).json({ notes });
  } catch (e) {
    console.error("Error while fetching all notes::", e);
    return res.status(500).send("Internal Server Error.");
  }
};

export const createNote = async (
  req: Request<unknown, unknown, NoteSchemaBodyType>,
  res: Response,
) => {
  // get the current user
  const { _id } = res.locals.user || { _id: null };

  const { title, markdown, tags } = req.body;
  // lets store this note into the db
  try {
    const addedNote = await NoteModel.create({
      title,
      markdown,
      tags,
      author: _id,
    });
    return res.status(200).json(addedNote.toJSON());
  } catch (e) {
    console.error("Error occurred while creating note::", e);
    return res.status(500).send("Internal Error");
  }
};

export const getNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  // get the current user
  const { _id } = res.locals.user || { _id: null };

  try {
    const note = await NoteModel.findById(noteId);
    if (note && note.author.toString() !== _id.toString()) {
      res.status(403).send("Forbidden").end();
      return;
    }
    return res.status(200).json({ note });
  } catch (e) {
    console.error("Error occurred while fetching a single note::", e);
    return res.status(500).send("Internal server error");
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  // get the current user
  const { _id } = res.locals.user || { _id: null };

  try {
    const note = await NoteModel.findById(noteId);
    if (note && note.author.toString() !== _id.toString()) {
      res.status(403).send("Forbidden").end();
      return;
    }
    if (note) {
      const deleted = await NoteModel.findByIdAndDelete(noteId);
      return res.status(200).json({ deleted });
    }
    res.status(403).send("Forbidden").end();
    return;
  } catch (e) {
    console.error("Error occurred while Deleting a single note::", e);
    return res.status(500).send("Internal server error");
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { title, markdown, tags } = req.body;
  // get the current user
  const { _id } = res.locals.user || { _id: null };

  try {
    const note = await NoteModel.findById(noteId);
    if (note && note.author.toString() !== _id.toString()) {
      res.status(403).send("Forbidden").end();
      return;
    }
    if (note) {
      note.title = title;
      note.markdown = markdown;
      note.tags = tags;

      await note.save();
      return res.status(200).json({ note });
    } else {
      res.status(403).send("Forbidden").end();
      return;
    }

    return res.status(200).json({ note });
  } catch (e) {
    console.error("Error occurred while fetching a single note::", e);
    return res.status(500).send("Internal server error");
  }
};
