import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { NoteDataType } from "../shared/commonTypes";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import toast from "react-hot-toast";
import useNoteServices from "../services/useNoteServices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

interface NoteCardProps {
  note: NoteDataType;
  ind: string;
}

const NoteCard = ({ note, ind }: NoteCardProps) => {
  const [collabers, setCollabers] = useState(note.collaborators || []);

  const [openAddCollab, setOpenAddCollab] = useState(false);

  const handleClickOpenAddCollab = () => {
    setOpenAddCollab(true);
  };

  const handleClickCloseAddCollab = () => {
    setOpenAddCollab(false);
  };

  const [openManageCollab, setOpenManageCollab] = useState(false);

  const handleClickOpenManageCollab = () => {
    setOpenManageCollab(true);
  };

  const handleClickCloseManageCollab = () => {
    setOpenManageCollab(false);
  };

  const { deleteNote, addCollaborator, deleteCollaborator } = useNoteServices();

  const navigate = useNavigate();
  const deleteCollab = async (email: string) => {
    const toastId = toast.loading(
      "Please wait, while we are deleting this collaborator...",
    );
    try {
      const resp = await deleteCollaborator({
        params: { noteId: ind },
        body: { email: email },
      });
      setCollabers(collabers.filter((c) => c !== email));
      toast.success(resp);
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while deleting collaborator");
    } finally {
      toast.dismiss(toastId);
    }
  };
  const handleClick = () => {
    if (note.shared) {
      console.log("Click  ", `/my/collab/note/${ind}`);
      navigate(`/my/collab/note/${ind}`);
    } else {
      navigate(`/note/${ind}`);
    }
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
    <>
      <Card
        elevation={20}
        sx={{
          boxShadow: `0px 0px 10px  ${
            theme.palette.mode == "dark" ? "#ffffff" : "black"
          }`,
          "&:hover": {
            boxShadow: `0px 0px 25px ${
              theme.palette.mode == "dark" ? "#ffffff" : "black"
            }`,
          },
          borderRadius: 5,
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
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Title
            </Typography>
            {note.shared && (
              <Chip color="warning" label="Shared" size="small" />
            )}
          </Box>

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
          <CardActions
            sx={{ marginTop: "2em", justifyContent: "space-evenly" }}
          >
            <Tooltip title="Edit Note">
              <EditIcon
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();

                  !note.shared
                    ? navigate(`/note/${ind}/edit`)
                    : navigate(`/my/collab/note/${ind}/edit`);
                }}
              />
            </Tooltip>
            {!note.shared && (
              <>
                <Tooltip title="Delete Note">
                  <DeleteIcon color="error" onClick={(e) => handleDelete(e)} />
                </Tooltip>

                <Tooltip title="Manage Collaborators">
                  <Diversity1Icon
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpenManageCollab();
                    }}
                  />
                </Tooltip>
              </>
            )}
          </CardActions>
        </CardContent>
      </Card>
      <Dialog
        open={openAddCollab}
        onClose={handleClickCloseAddCollab}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries()); // eslint-disable-line
            const email = formJson.email;
            // set this emailId to be a collaborator
            const toastId = toast.loading("Setting collaborator...");
            try {
              const resp = await addCollaborator({
                body: { email: email },
                params: { noteId: ind },
              });
              setCollabers((prev) => [...prev, email]);
              toast.success(resp);
            } catch (err) {
              if (err && axios.isAxiosError(err)) {
                toast.error(err?.response?.data);
              } else {
                toast.error("Unknown error!");
              }
            } finally {
              toast.dismiss(toastId);
              handleClickCloseAddCollab();
            }
          },
        }}
      >
        <DialogTitle>Add Collaborators</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can only add an existing user as collaborator.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseAddCollab}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Manage COLLAB */}
      <Dialog open={openManageCollab} onClose={handleClickCloseManageCollab}>
        <DialogTitle>
          {`${collabers?.length ? "All Collaborators" : "No Collaborator Available"}`}
        </DialogTitle>
        <List sx={{ pt: 0 }}>
          {collabers.map((email) => (
            <ListItem disableGutters key={email}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
                <RemoveCircleOutlineIcon
                  color="error"
                  sx={{ ml: 3 }}
                  onClick={() => {
                    deleteCollab(email);
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disableGutters>
            <ListItemButton autoFocus onClick={handleClickOpenAddCollab}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add Collaborator" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
};

export default NoteCard;
