import React, { FormEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "../shared/useLocalStorage";
import { NoteDataType } from "../shared/commonTypes";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import ActionButtons from "../components/ActionButtons";
import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";

const EditTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const TitleRef = useRef<HTMLInputElement>(null);
  const MarkDownRef = useRef<HTMLInputElement>(null);
  const TagsRef = useRef<HTMLInputElement>(null);

  // get the params
  const { id } = useParams();

  // fetch all notes
  const [notes, setNotes] = useLocalStorage<NoteDataType>("notes", []);

  let filtered_note: NoteDataType = {
    title: "",
    tags: [],
    markdown: "",
  };

  if (id && Number(id) >= 0 && Number(id) < notes.length) {
    filtered_note = notes[Number(id)];
    // set Title using reducer action dispatch
    dispatch(setTitle(`EDIT :: ${filtered_note.title}`));

    // set the breadcrumbs using the action Dispatch
    dispatch(setBreadcrumbs(["/home", `/note/${id}/edit`]));
  }

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    const currentNoteData: NoteDataType = {
      title: TitleRef.current!.value,
      tags: TagsRef.current!.value.split(","),
      markdown: MarkDownRef.current!.value,
    };

    const ans = confirm("Are you sure about this edits ?");
    if (ans) {
      const toastId = toast.loading(
        "Please wait, while we are editing this note..."
      );
      setNotes((prev) => {
        let newNotes = [...prev];
        newNotes.splice(Number(id), 1, currentNoteData);
        return newNotes;
      });
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.success("Successfully edited !");
        navigate("/");
      }, 2000);
    }
  };

  return (
    <>
      {filtered_note.title.length === 0 ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <Stack direction="row" spacing={1}>
            {filtered_note.tags.map((tag) => (
              <Chip label={tag} color="primary" variant="outlined" />
            ))}
          </Stack>

          <form onSubmit={handleEdit}>
            <Box mt={5} display={"flex"} justifyContent={"space-between"}>
              <TextField
                required
                id="outlined-required"
                label="Title"
                inputRef={TitleRef}
                sx={{
                  width: "50%",
                }}
                defaultValue={filtered_note.title}
              />
              <TextField
                required
                id="outlined-required"
                label="Tags"
                inputRef={TagsRef}
                placeholder="Put Comma Seperated Values. No space in between"
                sx={{
                  width: "45%",
                }}
                defaultValue={filtered_note.tags.toString()}
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
                placeholder="Markdown is enabled in this section"
                defaultValue={filtered_note.markdown.toString()}
                fullWidth
              />
            </Box>
            <Stack direction="row" spacing={2} mt={3} justifyContent={"end"}>
              <Link to="/">
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
      )}
      <ActionButtons />
    </>
  );
};

export default EditTask;
