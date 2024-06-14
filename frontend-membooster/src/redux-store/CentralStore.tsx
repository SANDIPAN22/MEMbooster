// CONFIGURE a redux store here which is com,kmon for the entire App

import { configureStore } from "@reduxjs/toolkit";
import titleReducer from "../redux-store/reducers/TitleSlice";
import breadcrumbsReducer from "../redux-store/reducers/BreadcrumbsSlice";
import bgThemeReducer from "../redux-store/reducers/BgThemeSlice";
import accessTokenReducer from "../redux-store/reducers/AccessTokenSlice";
export const centralStore = configureStore({
  reducer: {
    title: titleReducer,
    breadcrumbs: breadcrumbsReducer,
    bgTheme: bgThemeReducer,
    accessToken: accessTokenReducer,
  },
});

export type RootState = ReturnType<typeof centralStore.getState>;
export type AppDispatch = typeof centralStore.dispatch;
