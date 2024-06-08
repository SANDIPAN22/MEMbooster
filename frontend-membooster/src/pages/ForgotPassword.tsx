import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import ActionButtons from "../components/ActionButtons";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { MagnifyingGlass } from "react-loader-spinner";
import {
  ForgotPasswordService,
  ResetPasswordService,
} from "../services/authServices";

const ForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOtpGenerate = async () => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    const email = emailRef.current!.value;
    if (re.test(email)) {
      try {
        const resp = await ForgotPasswordService({ emailId: email });
        console.log(resp);
        if (resp.code == 401) {
          toast.error("This account is not yet verified.");
        } else {
          toast.success(resp.data);
          handleClickOpen();
        }
      } catch (err) {
        toast.error("Unable to send OTP!");
      }
    } else {
      toast.error("Not a valid email!");
    }
  };
  return (
    <>
      <Toaster />
      <ActionButtons />
      <Container component="main" maxWidth="xs">
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          mt={8}
        >
          <Avatar sx={{ m: 2 }}>
            <MagnifyingGlass
              visible={true}
              height="180"
              width="180"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperClass="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#070707"
            />
          </Avatar>
          <Typography variant="h5">Recovering Account</Typography>
          <Typography variant="body1" sx={{ opacity: 0.5 }}>
            Enter registered email id below, we are going to send you OTP to
            verify. OTP will be expired after 90 mins.
          </Typography>
          <TextField
            sx={{ marginTop: "50px" }}
            id="standard-basic"
            label="Enter email id..."
            inputRef={emailRef}
            variant="standard"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label="Send OTP" onClick={handleOtpGenerate}></Chip>
                </InputAdornment>
              ),
            }}
          />
          <Link href="/login" variant="body2" m={4}>
            {"Let me take back to Log In"}
          </Link>
        </Box>
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
              const password = formJson.password;
              const confPassword = formJson.confPassword;
              if (confPassword !== password) {
                toast.error(
                  "New password and Confirm new password are not similar!",
                );
              } else {
                const payload = {
                  otp: otp as string,
                  emailId: emailRef.current!.value,
                  newPassword: password as string,
                  confirmNewPassword: confPassword as string,
                };
                try {
                  const resp = await ResetPasswordService(payload);
                  console.log(resp);
                  toast.success(resp.data);
                } catch (err) {
                  toast.error("Sorry, reset password process failed!");
                } finally {
                  handleClose();
                }
              }
            },
          }}
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To reset password, please enter the OTP that we have sent you via
              email and new password.
            </DialogContentText>
            <TextField
              margin="dense"
              autoFocus
              required
              name="otp"
              label="OTP"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              required
              type="password"
              name="password"
              label="New Password"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              required
              type="password"
              name="confPassword"
              label="Confirm New Password"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Reset</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ForgotPassword;
