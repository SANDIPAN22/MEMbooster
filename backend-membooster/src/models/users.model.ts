import {
  DocumentType,
  Severity,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argon2 from "argon2";
// generic options for the collection schema model ( like: Timestamp will be added or not, Severity level if any schema mismatch happened)
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "Users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
// pre safe hook define ==> to hashify the password string
@pre<User>("save", async function () {
  if (!this.isModified) {
    return;
  } else {
    const hashedPassword = await argon2.hash(this.password);
    this.password = hashedPassword;
  }
})
// Schema definition
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true, maxlength: 15 })
  name: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  // a method to validate the password, when this document will be retrieved then given psw == this doc's psw
  async function(this: DocumentType<User>, givenPsw: string) {
    try {
      return argon2.verify(this.password, givenPsw);
    } catch (e) {
      console.error("Unable to verify the password.", e);
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
