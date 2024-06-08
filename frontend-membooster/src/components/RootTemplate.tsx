import MyContainer from "./MyContainer";
import MyBreadcrumbs from "./MyBreadcrumbs";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store/CentralStore";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const RootTemplate = () => {
  const title = useSelector((state: RootState) => state.title.val);
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.values,
  );
  useEffect(() => {
    document.title = `MEMbooster - Note - ${title}`;
  }, [title]);
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();
  const logOutHandler = () => {
    setCookie("access_token", null, { path: "/" });
    navigate("/login");
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <MyContainer>
        <Box display={"flex"} justifyContent={"space-between"}>
          <MyBreadcrumbs paths={breadcrumbs} />
          {cookies.access_token ? (
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button href="/new_note">Add Note</Button>
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
