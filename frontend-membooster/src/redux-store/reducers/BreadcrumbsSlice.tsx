import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BreadcrumbsType {
  values: { name: string; path: string }[];
}

const initialState: BreadcrumbsType = {
  values: [],
};

export const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    setBreadcrumbs: (
      state,
      action: PayloadAction<{ name: string; path: string }[]>,
    ) => {
      state.values = action.payload;
    },
  },
});

export default breadcrumbsSlice.reducer;
export const { setBreadcrumbs } = breadcrumbsSlice.actions;
