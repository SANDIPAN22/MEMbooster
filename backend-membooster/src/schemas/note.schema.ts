import { object, string, TypeOf } from "zod";

export const noteSchemaObj = object({
  body: object({
    title: string({ required_error: "Title is mandatory." }),

    markdown: string({ required_error: "Write something to save." }),

    tags: string().array().nonempty("At least One tag is needed."),
  }),
});

export type NoteSchemaBodyType = TypeOf<typeof noteSchemaObj>["body"];
