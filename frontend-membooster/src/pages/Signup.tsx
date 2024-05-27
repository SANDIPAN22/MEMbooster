import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <>
      <Box
        display={"flex"}
        width={"100vw"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        bgcolor={"lightgray"}
      >
        <Card
          elevation={20}
          sx={{
            width: { xs: "300px", sm: "550px" },

            borderRadius: "12px",
          }}
        >
          <form>
            <CardContent>
              <Typography
                sx={{ fontSize: 40 }}
                color="text.secondary"
                boxShadow={"1px 1px 12px"}
                borderRadius={2}
                textAlign={"center"}
                mb={4}
              >
                SIGN UP
              </Typography>

              <TextField
                id="outlined-error-helper-text"
                label="Email"
                type="email"
                sx={{ marginBottom: "25px" }}
                fullWidth
              />
              <TextField
                id="outlined-error-helper-text"
                label="Password"
                type={showPassword ? "text" : "password"}
                sx={{ marginBottom: "20px" }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "center", margin: 2 }}>
              <LoadingButton
                variant="outlined"
                loadingPosition="start"
                fullWidth
              >
                Sign Up
              </LoadingButton>
            </CardActions>
          </form>
          <Typography textAlign={"center"} m={2}>
            If you already have account with us, please
            <Link to={"/login"}>log in</Link>.
          </Typography>
        </Card>
      </Box>
    </>
  );
};

export default Signup;
