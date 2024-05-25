import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BreadcrumbsType {
  values: string[];
}

const initialState: BreadcrumbsType = {
  values: [],
};

export const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<string[]>) => {
      state.values = action.payload;
    },
  },
});

export default breadcrumbsSlice.reducer;
export const { setBreadcrumbs } = breadcrumbsSlice.actions;
