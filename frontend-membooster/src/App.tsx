import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
const Login = lazy(() => import("./pages/Login"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewNote = lazy(() => import("./pages/NewNote"));
import Loader from "./components/Loader";
import ShowTask from "./pages/ShowTask";
import EditTask from "./pages/EditTask";
import RootTemplate from "./components/RootTemplate";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { PaletteType } from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "./redux-store/CentralStore";

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
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/" element={<RootTemplate />}>
              <Route index element={<Dashboard />} />
              <Route path="note/:id">
                <Route index element={<ShowTask />} />
                <Route path="edit" element={<EditTask />} />
              </Route>
              <Route path="new_note" element={<NewNote />}></Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Suspense>
  );
};
export default App;
