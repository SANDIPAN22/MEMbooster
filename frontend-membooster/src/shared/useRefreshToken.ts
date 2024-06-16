import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux-store/reducers/AccessTokenSlice";
import axios from "axios";
import useLocalStorage from "./useLocalStorage";
const HOST = import.meta.env.VITE_BACKEND_HOST;

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const [refreshToken, _setRefreshToken] = useLocalStorage(
    "refresh_token",
    "default",
  );
  const setAndGetAccessToken = async (): Promise<string> => {
    try {
      const resp = await axios.post(`${HOST}/api/auth/refresh_access_token`, {
        refresh_token: refreshToken,
      });

      console.log("New Token==>", resp.data.access_token);
      // store the new access token in Redux store
      dispatch(setAccessToken(resp.data.access_token));
      // returning the AT
      return resp.data.access_token || "";
    } catch (err) {
      console.error("Error at Refreshing the access token using RT::", err);
      throw err;
    }
  };
  return setAndGetAccessToken;
};

export default useRefreshToken;
