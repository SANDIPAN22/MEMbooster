import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import Face2Icon from "@mui/icons-material/Face2";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginService } from "../services/authServices";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../components/ActionButtons";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux-store/reducers/AccessTokenSlice";
import { Checkbox, FormControlLabel } from "@mui/material";
import useLocalStorage from "../shared/useLocalStorage";

const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z.string().min(1, "Password is required"),
});

type LoginType = z.infer<typeof loginSchema>;

export default function Login() {
  const [checked, setChecked] = React.useState(true);
  const [_isPersistent, setIsPersistent] = useLocalStorage<boolean>(
    "persistent",
    true,
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setIsPersistent((prev) => {
      console.log(prev);
      return event.target.checked;
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({ resolver: zodResolver(loginSchema) });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    // call the backend
    try {
      const resp = await LoginService(data);
      if (resp.code === 200) {
        // we will be getting AT and RT. RT is already handled by the backend and saved as a HTTPOnly cookie.
        // But for AT we need to save this in Redux store So that protectedRoute can check it first
        dispatch(setAccessToken(resp.data?.access_token));
        navigate("/", { replace: true });
      } else {
        toast.error(resp.error_msg);
      }
    } catch (err) {
      toast.error("Unable to login...");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Toaster />
      <ActionButtons />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <Face2Icon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            error={errors.email ? true : false}
            {...register("email")}
            helperText={errors.email?.message}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={errors.password ? true : false}
            {...register("password")}
            helperText={errors.password?.message}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            label="Remember me"
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot_password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
