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

  @prop()
  collaborators: string[];

  // all the notes will be deleted after 15 days of creation (constraint of free version)
  @prop({ default: Date.now, expires: 1296000 })
  entryTimestamp: Date;

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
