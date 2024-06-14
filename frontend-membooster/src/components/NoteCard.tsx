import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { NoteDataType } from "../shared/commonTypes";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardActions, useTheme } from "@mui/material";
import toast from "react-hot-toast";
import useNoteServices from "../services/useNoteServices";

interface NoteCardProps {
  note: NoteDataType;
  ind: string;
}

const NoteCard = ({ note, ind }: NoteCardProps) => {
  const { deleteNote } = useNoteServices();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/note/${ind}`);
  };
  const theme = useTheme();
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ans = confirm("Are you sure about this deletion?");
    if (ans) {
      // delete the note
      const toastId = toast.loading(
        "Please wait, while we are deleting this note...",
      );
      try {
        await deleteNote({
          params: { noteId: ind },
        });
        navigate(0);
      } catch (err) {
        console.error(err);
        toast.error("Error occurred to load the note!");
      } finally {
        toast.dismiss(toastId);
      }
    }
  };
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
        onClick={handleClick}
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
          {note.tags.map((tag, index) => {
            return <Chip label={tag} key={index} />;
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
          <Button size="small" color="error" onClick={(e) => handleDelete(e)}>
            Delete
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
