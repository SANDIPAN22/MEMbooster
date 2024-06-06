import { Breadcrumbs, Link } from "@mui/material";

interface MyBreadCrumbsProp {
  paths: { name: string; path: string }[];
}

const MyBreadcrumbs = ({ paths }: MyBreadCrumbsProp) => {
  return (
    <>
      <Breadcrumbs>
        {paths.map((path, index) => {
          return (
            <Link underline="hover" href={path.path} key={index}>
              {path.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default MyBreadcrumbs;
