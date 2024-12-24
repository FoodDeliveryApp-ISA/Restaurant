import {
  BrowserRouter as Router,
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

const App = () => (
  <div className="App">
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LoginRegister />} />
          <Route element={<Main />}>
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:id" element={<MenuDetailsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Redirect from unknown routes to / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </div>
);

export default App;
