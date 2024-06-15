import { useEffect, useRef, useState } from "react";
import { Alert, Box, TextField } from "@mui/material";
import RenderAllNotes from "../components/RenderAllNotes";
import ActionButtons from "../components/ActionButtons";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";
import { NoteDataType } from "../shared/commonTypes";
import useNoteServices from "../services/useNoteServices";
import toast from "react-hot-toast";
import { RevolvingDot } from "react-loader-spinner";
// import { API } from "../shared/useWithTokenAxiosInstance";

interface NoteFiltersType {
  searchingTitle: string;
  searchingTags: string[];
}

const Dashboard = () => {
  const TitleRef = useRef<HTMLInputElement>(null);
  const TagsRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  // const [notes, _setNotes] = useLocalStorage("notes", []); when no backend is available
  const [notes, setNotes] = useState<NoteDataType[]>([]);

  const [filters, setFilters] = useState<NoteFiltersType>({
    searchingTitle: "",
    searchingTags: [],
  });

  const handleKeyUp = () => {
    const searchingTitle: string = TitleRef.current?.value || "";
    const searchingTags: string[] = TagsRef.current?.value
      ? TagsRef.current?.value.split(",")
      : [];

    setFilters({ searchingTitle, searchingTags });
  };
  useEffect(() => {
    // set Title using reducer action dispatch inside rootTemplate

    dispatch(setTitle("All Notes"));

    // set the breadcrumbs using the action Dispatch inside rootTemplate
    dispatch(setBreadcrumbs([{ path: "/", name: "home" }]));
  }, []); // eslint-disable-line

  // useEffect to fetch all the notes from the backend
  const { getNotes } = useNoteServices();
  const [fetchingNotes, setFetchingNotes] = useState<boolean>(false);
  useEffect(() => {
    const fetchNotes = async () => {
      setFetchingNotes(true);
      try {
        const resp = await getNotes();

        setNotes(resp.notes);
      } catch (err) {
        console.error("Error at Dashboard::", err);
        toast.error("Facing issue in fetching notes...");
      } finally {
        setFetchingNotes(false);
      }
    };
    fetchNotes();
  }, []); // eslint-disable-line

  return (
    <>
      <form>
        <Box mt={5} display={"flex"} justifyContent={"space-between"}>
          <TextField
            required
            id="outlined-required"
            label="Title"
            inputRef={TitleRef}
            sx={{
              width: "50%",
            }}
            onChange={handleKeyUp}
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
            onChange={handleKeyUp}
          />
        </Box>
      </form>
      {fetchingNotes && (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={8}
        >
          <RevolvingDot
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="revolving-dot-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </Box>
      )}
      {notes.length > 0 ? (
        <RenderAllNotes notes={notes} filters={filters}></RenderAllNotes>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={8}
        >
          <Alert severity="info">You haven't saved any note yet.</Alert>
        </Box>
      )}

      <ActionButtons />
    </>
  );
};

export default Dashboard;
