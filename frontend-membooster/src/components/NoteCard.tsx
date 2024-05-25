import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { NoteDataType } from "../shared/commonTypes";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

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
  return (
    <CardContent
      onClick={() => handleClick(ind)}
      sx={{
        border: "1px solid gray",
        borderRadius: "2px",
        minWidth: "18rem",
        maxWidth: "18rem",
        boxShadow: `5px 5px 8px ${
          theme.palette.mode == "dark" ? "#D6D6D6" : "black"
        }`,
        "&:hover": {
          boxShadow: `5px 10px 8px ${
            theme.palette.mode == "dark" ? "#D6D6D6" : "black"
          }`,
        },
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
    </CardContent>
  );
};

export default NoteCard;
