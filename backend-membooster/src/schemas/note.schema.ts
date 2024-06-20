import { object, string, TypeOf } from "zod";

export const noteSchemaObj = object({
  body: object({
    title: string({ required_error: "Title is mandatory." }),

    markdown: string({ required_error: "Write something to save." }),

    tags: string().array().nonempty("At least One tag is needed."),
  }),
});

export const manageNoteCollaboratorsObj = object({
  body: object({
    email: string().email("This is not a valid email address."),
  }),
  params: object({
    noteId: string().min(1, "NoteId is necessary to manage collaborators."),
  }),
});

export type NoteSchemaBodyType = TypeOf<typeof noteSchemaObj>["body"];

export type manageNoteCollaboratorsBodyType = TypeOf<
  typeof manageNoteCollaboratorsObj
>["body"];

export type manageNoteCollaboratorsParamsType = TypeOf<
  typeof manageNoteCollaboratorsObj
>["params"];
