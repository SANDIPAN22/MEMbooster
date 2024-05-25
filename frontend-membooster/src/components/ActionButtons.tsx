import React, { useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";

import ThemeSwitch from "./ThemeSwitch";
const ActionButtons = () => {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1 },
        position: "fixed",
        right: "5%",
        top: "85%",
      }}
    >
      <Link to={"/new_note"}>
        <Fab
          variant="extended"
          sx={{ opacity: "0.8", "&:hover": { opacity: "1" } }}
        >
          <AddIcon />
          Add Note
        </Fab>
      </Link>

      <Fab
        variant="extended"
        sx={{ opacity: "0.8", "&:hover": { opacity: "1" } }}
      >
        <ThemeSwitch />
      </Fab>
    </Box>
  );
};

export default ActionButtons;
