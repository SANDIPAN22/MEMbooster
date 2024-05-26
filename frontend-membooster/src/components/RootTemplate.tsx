import MyContainer from "./MyContainer";
import MyBreadcrumbs from "./MyBreadcrumbs";
import { Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store/CentralStore";
import { useEffect } from "react";

const RootTemplate = () => {
  const title = useSelector((state: RootState) => state.title.val);
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.values
  );
  useEffect(() => {
    document.title = `MEMBoooster - Note - ${title}`;
  }, [title]);
  return (
    <>
      <div>
        <Toaster />
      </div>
      <MyContainer>
        <MyBreadcrumbs paths={breadcrumbs} />
        <Typography variant="h2">{title}</Typography>
        <Outlet />
      </MyContainer>
    </>
  );
};

export default RootTemplate;
