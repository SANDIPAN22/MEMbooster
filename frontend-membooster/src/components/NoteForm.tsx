import { FormEvent, useRef, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { NoteDataType } from "../shared/commonTypes";
import TextEditor from "./TextEditor";

interface NoteFormProps {
  saveNote: (data: NoteDataType) => void;
}

const NoteForm = ({ saveNote }: NoteFormProps) => {
  const TitleRef = useRef<HTMLInputElement>(null);

  const TagsRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const currentNoteData: NoteDataType = {
      title: TitleRef.current!.value,
      tags: TagsRef.current!.value.split(","),
      markdown: text,
    };

    saveNote(currentNoteData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box mt={5} display={"flex"} justifyContent={"space-between"}>
          <TextField
            required
            id="outlined-required"
            label="Title"
            inputRef={TitleRef}
            sx={{
              width: "50%",
            }}
          />
          <TextField
            required
            id="outlined-required"
            label="Tags"
            inputRef={TagsRef}
            placeholder="Put Comma Seperated Values"
            sx={{
              width: "45%",
            }}
          />
        </Box>
        <Box mt={3}>
          <TextEditor text={text} readOnly={false} setText={setText} />
        </Box>
        <Stack direction="row" spacing={2} mt={3} justifyContent={"end"}>
          <Link to="..">
            <Button variant="outlined" startIcon={<DeleteIcon />}>
              CANCEL
            </Button>
          </Link>
          <Button variant="contained" endIcon={<SendIcon />} type="submit">
            SAVE
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default NoteForm;
