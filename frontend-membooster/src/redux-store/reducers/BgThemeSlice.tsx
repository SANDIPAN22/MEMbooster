import { createSlice } from "@reduxjs/toolkit";

interface BgThemeType {
  color: string;
}
const initialState: BgThemeType = {
  color: "dark",
};

const bgThemeSlice = createSlice({
  name: "bgTheme",
  initialState,
  reducers: {
    switchBgTheme: (state) => {
      if (state.color == "light") {
        state.color = "dark";
      } else {
        state.color = "light";
      }
    },
  },
});

export default bgThemeSlice.reducer;

export const { switchBgTheme } = bgThemeSlice.actions;
