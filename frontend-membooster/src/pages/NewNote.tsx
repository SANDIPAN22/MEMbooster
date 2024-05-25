import NoteForm from "../components/NoteForm";
import useLocalStorage from "../shared/useLocalStorage";
import { NoteDataType } from "../shared/commonTypes";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";

const NewNote = () => {
  const blank_notes: NoteDataType[] = [];
  const [_notes, setNotes] = useLocalStorage("notes", blank_notes);
  const navigate = useNavigate();
  const saveNote = (currNote: NoteDataType) => {
    setNotes((prevNotes: NoteDataType[]) => {
      console.log("Previous status ==>", prevNotes);
      return [...prevNotes, currNote];
    });
    const toastId = toast.loading("Saving in progress!");
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success("Saved Successfully!");
      navigate("/");
    }, 2000);
  };
  const dispatch = useDispatch();
  dispatch(setTitle("Add Note"));
  dispatch(setBreadcrumbs(["home", "new_note"]));
  return <NoteForm saveNote={saveNote} />;
};

export default NewNote;
