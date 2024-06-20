import { Request, Response } from "express";
import NoteModel from "../models/notes.model";
import {
  NoteSchemaBodyType,
  manageNoteCollaboratorsBodyType,
  manageNoteCollaboratorsParamsType,
} from "../schemas/note.schema";

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
    const _note = await NoteModel.findById(noteId);
    const note = _note?.toJSON();
    const noteAuthor = note?.author.toJSON();
    if (note && noteAuthor?.toString() !== _id) {
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
  } catch (e) {
    console.error("Error occurred while fetching a single note::", e);
    return res.status(500).send("Internal server error");
  }
};

export const addCollaborator = async (
  req: Request<
    manageNoteCollaboratorsParamsType,
    unknown,
    manageNoteCollaboratorsBodyType
  >,
  res: Response,
) => {
  const { noteId } = req.params;
  const { email } = req.body;
  // get the current user
  const { _id } = res.locals.user || { _id: null };

  try {
    // check whether this noteId is present for this current author or not
    const note = await NoteModel.findById(noteId);
    if (!note) {
      console.error(`Note not found`);
      return res.status(400).send("Bad Request");
    } else if (note.author.toString() !== _id) {
      console.error("Requester is not the author of this note");
      return res.status(400).send("Bad Request");
    }
    // check whether anyone is trying to nominate himself as a collaborator
    else if (email === res.locals.user.email) {
      console.error("Requester is trying to set himself as a collaborator");
      return res
        .status(400)
        .send("You can not set yourself as a collaborator.");
    }
    // check whether the collaborator is already present or not
    if (note.collaborators && note.collaborators.includes(email)) {
      console.error(
        "Requester is trying to set a collaborator who is already present as collaborator",
      );
      return res.status(400).send("Already present as a collaborator.");
    }
    //then add email in the collaborator array
    note.collaborators.push(email);
    await note.save();
    return res.status(200).send("The collaborator is added successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

export const deleteCollaborator = async (
  req: Request<
    manageNoteCollaboratorsParamsType,
    unknown,
    manageNoteCollaboratorsBodyType
  >,
  res: Response,
) => {
  const { noteId } = req.params;
  const { email } = req.body;
  // get the current user
  const { _id } = res.locals.user || { _id: null };
  try {
    const note = await NoteModel.findById(noteId);
    if (!note) {
      console.error(`Note not found`);
      return res.status(400).send("Bad Request");
    }
    if (note.author.toString() !== _id) {
      console.error("Requester is not the author of this note");
      return res.status(400).send("Bad Request");
    }
    // if the the requested email is present as collaborator then delete it from the collaborator list
    if (note.collaborators && note.collaborators.includes(email)) {
      note.collaborators = note.collaborators.filter(
        (collaborator) => collaborator !== email,
      );
      await note.save();
      return res.status(200).send("The collaborator is deleted successfully.");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllNotesAsCollaborator = async (
  req: Request,
  res: Response,
) => {
  try {
    // get the current user
    const { email } = res.locals.user || { email: null };

    const notes = await NoteModel.find({ collaborators: email });

    return res.status(200).json({ notes });
  } catch (e) {
    console.error("Error at getAllNotesAsCollaborator::", e);
    return res.status(500).send("Internal Server Error.");
  }
};

export const updateNoteAsCollaborator = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { title, markdown, tags } = req.body;
  // get the current user
  const { email } = res.locals.user || { email: null };

  try {
    const note = await NoteModel.findById(noteId);
    if (!note) {
      console.error(`Note not found`);
      return res.status(400).send("Bad Request");
    }
    if (note.collaborators && note.collaborators.includes(email)) {
      note.title = title;
      note.markdown = markdown;
      note.tags = tags;

      await note.save();
      return res.status(200).json({ note });
    } else {
      res.status(403).send("Forbidden").end();
      return;
    }
  } catch (e) {
    console.error("Error updateNoteAsCollaborator ::", e);
    return res.status(500).send("Internal server error");
  }
};

export const getNoteAsCollaborator = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  // get the current user
  const { email } = res.locals.user || { _id: null };

  try {
    const _note = await NoteModel.findById(noteId);
    const note = _note?.toJSON();

    if (!note) {
      console.error(`Note not found`);
      return res.status(400).send("Bad Request");
    }
    if (note.collaborators && note.collaborators.includes(email)) {
      return res.status(200).json({ note });
    } else {
      res.status(403).send("Forbidden").end();
      return;
    }
  } catch (e) {
    console.error("Error occurred while fetching a single note::", e);
    return res.status(500).send("Internal server error");
  }
};
