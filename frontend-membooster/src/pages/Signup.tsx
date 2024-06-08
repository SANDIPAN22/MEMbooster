import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import {
  OtpVerificationService,
  SignUpService,
} from "../services/authServices";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../components/ActionButtons";

const createUserSchemaObj = z
  .object({
    name: z
      .string({ required_error: "The name is required!" })
      .min(1, "The name is required!"),

    password: z
      .string({ required_error: "The password is required!" })
      .min(6, "The minimum of 6 chars is needed!"),

    confirmPassword: z.string({
      required_error: "The confirm password is required!",
    }),

    email: z
      .string({ required_error: "The email is required!" })
      .email("It doesn't seem like a valid email!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CreateUserSchemaType = z.infer<typeof createUserSchemaObj>;

const Signup = () => {
  const navigate = useNavigate();
  const [tempId, setTempId] = useState<string>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchemaObj),
  });
  //onSubmit function
  const onSubmit: SubmitHandler<CreateUserSchemaType> = async (data) => {
    console.log(data);

    try {
      const resp = await SignUpService(data);

      if (resp.status === "success" && resp.code === 201) {
        console.log(resp.data);
        setTempId(resp.data.temp_id);
        setOpen(true);
      } else {
        toast.error(resp.error_msg);
      }
    } catch (err) {
      toast.error("Sign Up failed.");
    }
  };
  return (
    <>
      <Toaster />
      <ActionButtons />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <SensorOccupiedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={errors.name ? true : false}
                  helperText={errors.name?.message}
                  autoComplete="given-name"
                  {...register("name")}
                  required
                  fullWidth
                  label="Full Name"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  error={errors.email ? true : false}
                  helperText={errors.email?.message}
                  {...register("email")}
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={errors.password ? true : false}
                  {...register("password")}
                  helperText={errors.password?.message}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          // onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={errors.confirmPassword ? true : false}
                  helperText={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          // onMouseDown={handleMouseDownConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const otp = formJson.otp;

            const toastId = toast.loading(
              "Verifying your email. Please wait...",
            );
            const payload = {
              userOtp: otp as string,
              userId: tempId || "",
            };
            console.log(payload);
            try {
              const resp = await OtpVerificationService(payload);
              console.log(resp);
              if (resp.code === 202) {
                navigate("/login", { replace: true });
              }
            } catch (err) {
              toast.error("Failed to verify your OTP. Try again!");
            } finally {
              setOpen(false);
              toast.dismiss(toastId);
            }
            // handleClose();
          },
        }}
      >
        <DialogTitle>Verify Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To verify email, please enter the OTP that we have sent you via
            email.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="otp"
            name="otp"
            label="OTP"
            fullWidth
            variant="standard"
          />
          <Alert severity="info">The OTP will expire after 5 minutes.</Alert>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel Sign Up
          </Button>
          <Button color="success" type="submit">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Signup;
