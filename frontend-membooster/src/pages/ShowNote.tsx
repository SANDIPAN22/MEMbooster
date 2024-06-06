import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import ActionButtons from "../components/ActionButtons";
import { Navigate, useParams } from "react-router-dom";
import useLocalStorage from "../shared/useLocalStorage";
import { NoteDataType } from "../shared/commonTypes";
import { Chip, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import TextEditor from "../components/TextEditor";

const ShowTask = () => {
  useEffect(() => {
    const toolBar = document.getElementsByClassName(
      "ql-toolbar",
    )[0] as HTMLElement;

    toolBar.innerHTML =
      "<div >Editing is disabled as you are in 'view' mode. </div>";
    toolBar.style.opacity = "0.5";
  });
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
    dispatch(
      setBreadcrumbs([
        { path: "/", name: "home" },
        { path: `${id}`, name: `NOTE - ${id}` },
      ]),
    );
  }
  console.log("This one is ", filtered_note);
  return (
    <>
      {filtered_note.title.length === 0 ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <Stack direction="row" spacing={1} mb={2}>
            {filtered_note.tags.map((tag) => (
              <Chip label={tag} color="primary" variant="outlined" />
            ))}
          </Stack>
          <Divider />
          {/* <Markdown remarkPlugins={[remarkGfm, rehypeHighlight]}>
            {filtered_note.markdown}
          </Markdown> */}
          <TextEditor text={filtered_note.markdown} readOnly={true} />
        </>
      )}
      <ActionButtons />
    </>
  );
};

export default ShowTask;
