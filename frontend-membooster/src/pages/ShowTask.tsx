import React from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import ActionButtons from "../components/ActionButtons";
import { Navigate, useParams } from "react-router-dom";
import useLocalStorage from "../shared/useLocalStorage";
import { NoteDataType } from "../shared/commonTypes";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Chip, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";

const ShowTask = () => {
  const dispatch = useDispatch();

  // get the params
  const { id } = useParams();

  // fetch all notes
  const [notes, _setNotes] = useLocalStorage<NoteDataType>("notes", []);

  let filtered_note: NoteDataType = {
    title: "",
    tags: [],
    markdown: "",
  };

  if (id && Number(id) >= 0 && Number(id) < notes.length) {
    filtered_note = notes[Number(id)];
    // set Title using reducer action dispatch
    dispatch(setTitle(filtered_note.title));

    // set the breadcrumbs using the action Dispatch
    dispatch(setBreadcrumbs(["home", `${id}`]));
  }
  console.log("This one is ", filtered_note);
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
          <Divider />
          <Markdown remarkPlugins={[remarkGfm, rehypeHighlight]}>
            {filtered_note.markdown}
          </Markdown>
        </>
      )}
      <ActionButtons />
    </>
  );
};

export default ShowTask;
