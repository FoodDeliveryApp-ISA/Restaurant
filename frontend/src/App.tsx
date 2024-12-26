import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Main from "./components/Layout/Main";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Menu from "./pages/Menu/Menu";
import MenuDetailsPage from "./pages/MenuDetailsPage/MenuDetailsPage";
import Profile from "./pages/Profile/Profile";
import NotFoundPage from "./pages/404"; // Import the 404 component
import ForbiddenPage from "./pages/403"; // Import the 403 component
import PrivateRoute from "./routes/PrivateRoute";

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LoginRegister />} />
          <Route element={<Main />}>
            {/* Private Routes */}
            <Route path="/menu" element={<PrivateRoute element={<Menu />} />} />
            <Route
              path="/menu/:id"
              element={<PrivateRoute element={<MenuDetailsPage />} />}
            />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          </Route>

          {/* 403 Forbidden Route */}
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;

