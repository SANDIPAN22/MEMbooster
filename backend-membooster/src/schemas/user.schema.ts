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

export const verifyUserSchemaObj = object({
  body: object({
    userId: string(),
    userOtp: string({ required_error: "The OTP is required." }),
  }),
});

export const resetPasswordSchemaObj = object({
  body: object({
    emailId: string({ required_error: "The email-id is mandatory." }).email(),
  }),
});

export const changePasswordSchemaObj = object({
  query: object({
    emailId: string().email(),
    otp: string(),
  }),
  body: object({
    newPassword: string(),
    confirmNewPassword: string(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message:
      "The New Password and the Confirmed New Password should be similar.",
    path: ["confirmNewPassword"],
  }),
});
export type CreateUserSchemaType = TypeOf<typeof createUserSchemaObj>["body"];

export type VerifyUserSchemaType = TypeOf<typeof verifyUserSchemaObj>["body"];

export type ResetPasswordSchemaType = TypeOf<
  typeof resetPasswordSchemaObj
>["body"];

export type ChangePasswordSchemaTypeParams = TypeOf<
  typeof changePasswordSchemaObj
>["query"];

export type ChangePasswordSchemaTypeBody = TypeOf<
  typeof changePasswordSchemaObj
>["body"];
