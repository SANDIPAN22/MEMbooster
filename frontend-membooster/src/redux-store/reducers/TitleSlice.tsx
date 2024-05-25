import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TitleType {
  val: string;
}

const initialState: TitleType = {
  val: "",
};

export const titleSlice = createSlice({
  name: "title",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.val = action.payload;
    },
  },
});

export default titleSlice.reducer;
export const { setTitle } = titleSlice.actions;
