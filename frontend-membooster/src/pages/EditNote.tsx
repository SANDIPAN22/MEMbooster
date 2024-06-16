import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { NoteDataType } from "../shared/commonTypes";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import ActionButtons from "../components/ActionButtons";
import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";
import TextEditor from "../components/TextEditor";
import useNoteServices from "../services/useNoteServices";

const EditTask = () => {
  const [text, setText] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const TitleRef = useRef<HTMLInputElement>(null);
  const TagsRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<NoteDataType>();
  const [loading, setLoading] = useState(true);
  const { updateNote, getNote } = useNoteServices();
  // get the params
  const { id } = useParams();

  // fetch the particular note
  useEffect(() => {
    const toastId = toast.loading("Fetching and loading the note...");
    (async () => {
      try {
        const resp = await getNote({ params: { noteId: id || "" } });
        setText(resp.note.markdown);
        setNote(resp.note);
      } catch (err) {
        console.error(err);
        toast.error("Error occurred to load the note!");
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line

  useEffect(() => {
    // set Title using reducer action dispatch
    dispatch(setTitle(`EDIT :: ${note?.title}`));

    // set the breadcrumbs using the action Dispatch
    dispatch(
      setBreadcrumbs([
        { path: "/", name: "home" },
        { path: `/note/${id}/edit`, name: `EDIT NOTE - ${id}` },
      ]),
    );
  }, [loading, note, id]); // eslint-disable-line

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    const currentNoteData: NoteDataType = {
      title: TitleRef.current!.value,
      tags: TagsRef.current!.value.split(","),
      markdown: text,
    };

    const ans = confirm("Are you sure about this edits ?");
    if (ans) {
      const toastId = toast.loading(
        "Please wait, while we are editing this note...",
      );
      try {
        await updateNote({
          body: currentNoteData,
          params: { noteId: id || "" },
        });

        navigate("/");
      } catch (err) {
        toast.error("Problem faced while saving this note.");
      } finally {
        toast.dismiss(toastId);
      }
    }
  };
  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      {!note ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <Stack direction="row" spacing={1}>
            {note?.tags.map((tag, index) => (
              <Chip
                label={tag}
                color="primary"
                key={index}
                variant="outlined"
              />
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
                defaultValue={note?.title}
              />
              <TextField
                required
                id="outlined-required"
                label="Tags"
                inputRef={TagsRef}
                placeholder="Put Comma Separated Values. No space in between"
                sx={{
                  width: "45%",
                }}
                defaultValue={note?.tags.toString()}
              />
            </Box>

            <Box mt={3}>
              <TextEditor text={text} readOnly={false} setText={setText} />
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
