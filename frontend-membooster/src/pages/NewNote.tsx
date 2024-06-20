import NoteForm from "../components/NoteForm";
import { NoteDataType } from "../shared/commonTypes";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import { useEffect } from "react";
import useNoteServices from "../services/useNoteServices";

const NewNote = () => {
  const { postNote } = useNoteServices();

  const navigate = useNavigate();

  const saveNote = async (currNote: NoteDataType) => {
    const toastId = toast.loading("Saving the note...");
    try {
      await postNote({ body: currNote });
      navigate("/");
    } catch (err) {
      toast.error("Problem faced while saving this note.");
    } finally {
      toast.dismiss(toastId);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Add Note"));
    dispatch(
      setBreadcrumbs([
        { path: "/", name: "home" },
        { path: `/new_note`, name: `NEW NOTE` },
      ]),
    );
  }, []); // eslint-disable-line
  return (
    <>
      {/* <ActionButtons /> */}
      <NoteForm saveNote={saveNote} />
    </>
  );
};

export default NewNote;
