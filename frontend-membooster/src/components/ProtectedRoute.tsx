import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store/CentralStore";
import { Navigate, Outlet } from "react-router-dom";
import useRefreshToken from "../shared/useRefreshToken";
import Loader from "./Loader";
import useLocalStorage from "../shared/useLocalStorage";

const ProtectedRoute = () => {
  const [isPersistent, _setIsPersistent] = useLocalStorage<boolean>(
    "persistent",
    true,
  );
  const setAndGetAccessToken = useRefreshToken();
  const [loading, setLoading] = useState<boolean>(true); // so that I can wait before checking the access token and navigating to login

  const AT = useSelector((state: RootState) => state.accessToken.access_token);

  const disableLoading = () => {
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      console.log("Persisting logic status=", isPersistent);
      if (isPersistent) {
        console.log(
          "persist flag is ON, So using Layout Effect to pre-fetch the access token and then allow protected routes",
        );

        try {
          const accessToken = await setAndGetAccessToken();
          console.log(
            "Due to persistent login, The fresh pre-fetched access token is ",
            accessToken,
          );
        } catch (err) {
          console.error(
            "Error happened when pre fetching the access token for persistent login",
            err,
          );
        } finally {
          disableLoading();
        }
      } else {
        disableLoading();
      }
    })();
  }, []); // eslint-disable-line

  if (loading) {
    return <Loader></Loader>;
  }
  return <>{AT.length > 0 ? <Outlet /> : <Navigate to="/login"></Navigate>}</>;
};
export default ProtectedRoute;
