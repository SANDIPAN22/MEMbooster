import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import ActionButtons from "../components/ActionButtons";
import { Navigate, useParams } from "react-router-dom";

import { NoteDataType } from "../shared/commonTypes";
import { Chip, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import TextEditor from "../components/TextEditor";
import toast from "react-hot-toast";
import useNoteServices from "../services/useNoteServices";

const ShowTask = ({ collabMode = false }: { collabMode?: boolean }) => {
  const { getNote, getNoteAsCollaborator } = useNoteServices();
  const [note, setNote] = useState<NoteDataType>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const toolBar = document.getElementsByClassName(
      "ql-toolbar",
    )[0] as HTMLElement;
    if (toolBar) {
      toolBar.innerHTML =
        "<div >Editing is disabled as you are in 'view' mode. </div>";
      toolBar.style.opacity = "0.5";
    }
  }, [loading]); // eslint-disable-line

  const dispatch = useDispatch();

  // get the params
  const { id } = useParams();

  // fetch the particular note
  useEffect(() => {
    const toastId = toast.loading("Fetching and loading the note...");
    (async () => {
      try {
        const resp = collabMode
          ? await getNoteAsCollaborator({ params: { noteId: id || "" } })
          : await getNote({ params: { noteId: id || "" } });

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
    dispatch(setTitle(note?.title || "Loading note..."));

    // set the breadcrumbs using the action Dispatch
    dispatch(
      setBreadcrumbs([
        { path: "/", name: "home" },
        { path: `/note/${id}`, name: `NOTE - ${id}` },
      ]),
    );
  }, [note, id]); // eslint-disable-line

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {console.log("COLLAB MOOODEE", collabMode)}
      {!note ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <Stack direction="row" spacing={1} mb={2}>
            {note!.tags.map((tag, index) => (
              <Chip
                label={tag}
                color="primary"
                variant="outlined"
                key={index}
              />
            ))}
          </Stack>
          <Divider />

          <TextEditor text={note!.markdown} readOnly={true} />
        </>
      )}
      <ActionButtons />
    </>
  );
};

export default ShowTask;
