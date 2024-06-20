export interface NoteDataType {
  title: string;
  tags: string[];
  markdown: string;
  _id?: string;
  collaborators?: string[];
  shared?: boolean;
}
