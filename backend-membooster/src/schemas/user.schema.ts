import { string, object, TypeOf } from "zod";

export const createUserSchemaObj = object({
  body: object({
    name: string({ required_error: "The name is required!" }),

    password: string({ required_error: "The password is required!" }).min(
      6,
      "The minimum of 6 chars is needed!",
    ),

    confirmPassword: string({
      required_error: "The confirm password is required!",
    }),

    email: string({ required_error: "The email is required!" }).email(
      "It doesn't seem like a valid email!",
    ),
  }).refine((data) => data.password == data.confirmPassword, {
    message: "The passwords are not matching!!",
    path: ["confirmPassword"],
  }),
});

export type CreateUserSchemaType = TypeOf<typeof createUserSchemaObj>["body"];
