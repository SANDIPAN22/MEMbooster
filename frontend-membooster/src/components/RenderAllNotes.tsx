import { Box } from "@mui/material";
import { NoteDataType } from "../shared/commonTypes";
import NoteCard from "./NoteCard";

interface RenderAllNotesProps {
  notes: NoteDataType[];
  filters: { searchingTitle: string; searchingTags: string[] };
}

function findIntersection(arr1: string[], arr2: string[]) {
  const ans = arr1.filter((element) => arr2.includes(element));
  return ans.length ? true : false;
}

const RenderAllNotes = ({ notes, filters }: RenderAllNotesProps) => {
  let finalNotes = notes;

  if (filters.searchingTitle?.length > 0 || filters.searchingTags?.length > 0) {
    finalNotes = notes.filter((note) => {
      if (filters.searchingTitle) {
        return (
          note.title
            .toLocaleLowerCase()
            .includes(filters.searchingTitle.toLocaleLowerCase()) ||
          findIntersection(note.tags, filters.searchingTags)
        );
      }

      return findIntersection(note.tags, filters.searchingTags);
    });
  }

  return (
    <>
      <Box
        mt={4}
        display={"flex"}
        gap={4}
        flexDirection={"row"}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        {finalNotes.map((note, index) => {
          return <NoteCard note={note} ind={index} />;
        })}
      </Box>
    </>
  );
};

export default RenderAllNotes;
