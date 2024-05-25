import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";

interface MyBreadCrumbsProp {
  paths: string[];
}

const MyBreadcrumbs = ({ paths }: MyBreadCrumbsProp) => {
  return (
    <>
      <Breadcrumbs>
        {paths.map((path, index) => {
          return (
            <Link underline="hover" href={path} key={index}>
              {path}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default MyBreadcrumbs;
