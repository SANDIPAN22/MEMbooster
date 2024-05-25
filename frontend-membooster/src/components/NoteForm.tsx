import React, { FormEvent, useRef } from "react";
import { Box, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import { NoteDataType } from "../shared/commonTypes";

interface NoteFormProps {
  saveNote: (data: NoteDataType) => void;
}

const NoteForm = ({ saveNote }: NoteFormProps) => {
  const TitleRef = useRef<HTMLInputElement>(null);
  const MarkDownRef = useRef<HTMLInputElement>(null);
  const TagsRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const currentNoteData = {
      title: TitleRef.current!.value,
      tags: TagsRef.current!.value.split(","),
      markdown: MarkDownRef.current!.value,
    };

    saveNote(currentNoteData);
    TitleRef.current!.value = "";
    TagsRef.current!.value = "";
    MarkDownRef.current!.value = "";
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
          <TextField
            multiline
            minRows={12}
            maxRows={100}
            inputRef={MarkDownRef}
            required
            id="outlined-required"
            label="Body"
            fullWidth
          />
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
