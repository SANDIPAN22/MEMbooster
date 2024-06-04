import { string, object, TypeOf } from "zod";

export const createSessionSchemaObj = object({
  body: object({
    email: string({ required_error: "Email is mandatory." }).email(
      "Invalid Email or password.",
    ),
    password: string({ required_error: "Password is mandatory." }).min(
      6,
      "Invalid email or Password.",
    ),
  }),
});

export type CreateSessionSchemaType = TypeOf<
  typeof createSessionSchemaObj
>["body"];
