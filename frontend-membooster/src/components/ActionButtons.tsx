import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import ThemeSwitch from "./ThemeSwitch";
const ActionButtons = () => {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1 },
        position: "fixed",
        left: "45%",
        top: "90%",
      }}
    >
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
