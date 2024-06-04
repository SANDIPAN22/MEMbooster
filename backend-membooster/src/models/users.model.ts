import {
  DocumentType,
  getModelForClass,
  index,
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
})
// pre safe hook define ==> to hashify the password string
@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  } else {
    const hashedPassword = await argon2.hash(this.password);
    this.password = hashedPassword;
  }
})
// New Index creation so that un-verified profiles can be deleted after mentioned time duration
@index(
  { entryTimestamp: -1 },
  { partialFilterExpression: { verified: false }, expires: 300 },
)

// Schema definition
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid(6) })
  verificationCode: string;

  @prop()
  passwordResetCode?: string;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: Date.now })
  entryTimestamp: Date;

  // a method to validate the password, when this document will be retrieved then given psw == this doc's psw
  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      console.error(e, "Could not validate password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
