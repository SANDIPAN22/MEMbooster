import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux-store/reducers/AccessTokenSlice";
import axios from "axios";

const HOST = import.meta.env.VITE_BACKEND_HOST_NAME;

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const setAndGetAccessToken = async (): Promise<string> => {
    try {
      // it is going to send the refresh token from HTTPOnly cookie hence we need to enable withCredentials mode ON
      const resp = await axios.post(
        `${HOST}/api/auth/refresh_access_token`,
        {},
        {
          withCredentials: true,
        },
      );

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
