import axios from "axios";
import { useSelector } from "react-redux";

import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import { RootState } from "../redux-store/CentralStore";

import { HOST } from "../../package.json";

// This axios instance is used to communicate with protected paths ONLY (added advantage is every request will contain Access_token
// and every response will handle two cases 1. if 401 then retry with new AT and if 403 then redirect to login via logout)
const API = axios.create({
  baseURL: HOST,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true
});

const useWithTokenAxiosInstance = () => {
  const setAndGetAccessToken = useRefreshToken();
  const accessToken = useSelector(
    (state: RootState) => state.accessToken.access_token,
  );

  // wrapping it inside useEffect because we need to eject the interceptors also
  useEffect(() => {
    // Request interceptors for API

    const reqInterceptors = API.interceptors.request.use(
      (config) => {
        // fetching AT from Redux Store

        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptors for API

    const resInterceptors = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("Retrying....", error);
        const originalRequest = error.config;
        // when a protected path returns 401 that means either access token is expired or not included,
        // hence retrying to get a new access token using the refresh token store in the HTTPonly cookie
        if (error.request.status == 401 && !originalRequest._retry) {
          console.log("GOT 401, HENCE trying to get NEW AT using RT");
          originalRequest._retry = true;
          try {
            //get new access token
            const newAT = await setAndGetAccessToken(); // generates a new access token and returns it after storing it in redux store
            // and retry the original request again
            console.log("After 401, we got the token ==>", newAT);
            originalRequest.headers.Authorization = `Bearer ${newAT}`;
            return axios(originalRequest);
          } catch (err) {
            console.error("Error at RefreshAccessTokenService::", err);

            throw err;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      API.interceptors.request.eject(reqInterceptors);
      API.interceptors.response.eject(resInterceptors);
    };
  }, []); // eslint-disable-line
  return API;
};

export default useWithTokenAxiosInstance;
