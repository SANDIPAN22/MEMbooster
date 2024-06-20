import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewNote = lazy(() => import("./pages/NewNote"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
import Loader from "./components/Loader";
import ShowTask from "./pages/ShowNote";
import EditTask from "./pages/EditNote";
import RootTemplate from "./components/RootTemplate";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { PaletteType } from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "./redux-store/CentralStore";
import "./assets/common.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ShowCollabNote from "./pages/ShowCollabNote";
import EditCollabNote from "./pages/EditCollabNote";

const App = () => {
  const bgTheme = useSelector((state: RootState) => state.bgTheme.color);
  const myTheme = createTheme({
    palette: {
      mode: bgTheme as PaletteType,
    },
  });

  return (
    <Suspense fallback={<Loader />}>
      <ThemeProvider theme={myTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/forgot_password" element={<ForgotPassword />}></Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<RootTemplate />}>
                <Route index element={<Dashboard />} />
                <Route path="note/:id">
                  <Route index element={<ShowTask />} />
                  <Route path="edit" element={<EditTask />} />
                </Route>
                <Route
                  path="/my/collab/note/:id"
                  element={<ShowCollabNote />}
                ></Route>
                <Route
                  path="/my/collab/note/:id/edit"
                  element={<EditCollabNote />}
                ></Route>
                <Route path="new_note" element={<NewNote />}></Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Suspense>
  );
};
export default App;
