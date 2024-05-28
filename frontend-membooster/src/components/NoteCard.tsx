import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { NoteDataType } from "../shared/commonTypes";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardActions, useTheme } from "@mui/material";
import useLocalStorage from "../shared/useLocalStorage";
import toast from "react-hot-toast";

interface NoteCardProps {
  note: NoteDataType;
  ind: number;
}

const NoteCard = ({ note, ind }: NoteCardProps) => {
  const navigate = useNavigate();
  const handleClick = (id: number) => {
    navigate(`/note/${id}`);
  };
  const theme = useTheme();
  const [_notes, setNotes] = useLocalStorage<NoteDataType>("notes", []);
  return (
    <Card
      elevation={20}
      sx={{
        "&:hover": {
          boxShadow: `0px 0px 15px ${
            theme.palette.mode == "dark" ? "#ffffff" : "black"
          }`,
        },
      }}
    >
      <CardContent
        onClick={() => handleClick(ind)}
        sx={{
          // border: "1px solid gray",
          borderRadius: "2px",
          minWidth: "18rem",
          maxWidth: "18rem",
          minHeight: "15rem",
        }}
      >
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Title
        </Typography>
        <Typography variant="h5" component="div" noWrap={true}>
          {note.title}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          gutterBottom
          mt={2}
        >
          Tags
        </Typography>
        <Typography variant="h6" component="div" noWrap={true}>
          {note.tags.map((tag) => {
            return <Chip label={tag} />;
          })}
        </Typography>
        <CardActions sx={{ marginTop: "2em", justifyContent: "space-between" }}>
          <Button
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/note/${ind}/edit`);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              const ans = confirm("Are you sure about this deletion?");
              if (ans) {
                const toastId = toast.loading(
                  "Please wait, while we are deleting this note...",
                );
                setNotes((currNotes: NoteDataType[]) => {
                  const new_notes = [...currNotes];
                  new_notes.splice(ind, 1);
                  return new_notes;
                });
                setTimeout(() => {
                  toast.dismiss(toastId);
                  toast.success("Successfully deleted !");
                  navigate(0);
                }, 2000);
              }
            }}
          >
            Delete
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
