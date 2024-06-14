import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AccessTokenSliceType {
  access_token: string;
}

const initialState: AccessTokenSliceType = {
  access_token: "",
};

const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    deleteAccessToken: (state) => {
      state.access_token = "";
    },
  },
});

export default accessTokenSlice.reducer;
export const { setAccessToken, deleteAccessToken } = accessTokenSlice.actions;
