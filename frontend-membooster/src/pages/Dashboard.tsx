import React, { useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import MyContainer from "../components/MyContainer";
import { Typography } from "@mui/material";
import MyBreadcrumbs from "../components/MyBreadcrumbs";
import RenderAllNotes from "../components/RenderAllNotes";
import useLocalStorage from "../shared/useLocalStorage";
import ActionButtons from "../components/ActionButtons";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux-store/reducers/TitleSlice";
import { setBreadcrumbs } from "../redux-store/reducers/BreadcrumbsSlice";

interface NoteFiltersType {
  searchingTitle: string;
  searchingTags: string[];
}

const Dashboard = () => {
  const TitleRef = useRef<HTMLInputElement>(null);
  const TagsRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useLocalStorage("notes", []);

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

  // set Title using reducer action dispatch
  const dispatch = useDispatch();
  dispatch(setTitle("All Notes"));

  // set the breadcrumbs using the action Dispatch
  dispatch(setBreadcrumbs(["home"]));

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

      <RenderAllNotes notes={notes} filters={filters}></RenderAllNotes>

      <ActionButtons />
    </>
  );
};

export default Dashboard;
