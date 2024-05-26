import { createSlice } from "@reduxjs/toolkit";

interface BgThemeType {
  color: string;
}
const initialState: BgThemeType = {
  color: localStorage.getItem("themeMode") || "dark",
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
      localStorage.setItem("themeMode", state.color);
    },
  },
});

export default bgThemeSlice.reducer;

export const { switchBgTheme } = bgThemeSlice.actions;
