import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";

interface MyBreadCrumbsProp {
  paths: { name: string; path: string }[];
}

const MyBreadcrumbs = ({ paths }: MyBreadCrumbsProp) => {
  return (
    <>
      <Breadcrumbs>
        {paths.map((path, index) => {
          return (
            <Link to={path.path} key={index} style={{ textDecoration: "none" }}>
              {/* <Typography variant="body1" sx={}> */}
              {path.name}
              {/* </Typography> */}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default MyBreadcrumbs;
