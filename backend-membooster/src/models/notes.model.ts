import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./users.model";

export class Note {
  @prop({ ref: () => User })
  author: Ref<User>;

  @prop({ required: true })
  markdown: string;

  @prop({ required: true })
  tags: string[];

  @prop({ required: true })
  title: string;

  @prop({ default: "1d" })
  period: string;

  @prop({ default: false })
  revisionFlag: boolean;
}

const NoteModel = getModelForClass(Note, {
  schemaOptions: {
    timestamps: true,
    collection: "Notes",
  },
});

export default NoteModel;
