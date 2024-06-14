import MyContainer from "./MyContainer";
import MyBreadcrumbs from "./MyBreadcrumbs";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store/CentralStore";
import { useEffect } from "react";
import { LogoutService } from "../services/authServices";

const RootTemplate = () => {
  const title = useSelector((state: RootState) => state.title.val);
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.values,
  );
  const access_token = useSelector(
    (state: RootState) => state.accessToken.access_token,
  );
  useEffect(() => {
    document.title = `MEMbooster - Note - ${title}`;
  }, [title]);

  const navigate = useNavigate();
  const logOutHandler = async () => {
    try {
      await LogoutService();
      navigate("/login");
    } catch (err) {
      toast.error("Failed to logout.");
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <MyContainer>
        <Box display={"flex"} justifyContent={"space-between"}>
          <MyBreadcrumbs paths={breadcrumbs} />
          {access_token ? (
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Link to="/new_note">
                <Button>Add Note</Button>
              </Link>

              <Button color="error" variant="outlined" onClick={logOutHandler}>
                Log Out
              </Button>
            </ButtonGroup>
          ) : (
            <></>
          )}
        </Box>

        <Typography variant="h2">{title}</Typography>
        <Outlet />
      </MyContainer>
    </>
  );
};

export default RootTemplate;
