import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Main from "./components/Main";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Menu from "./pages/Menu/Menu";

import MenuDetailsPage from "./pages/MenuDetailsPage/MenuDetailsPage";

const App = () => (
  <div className="App">
    <Router>
      {/* Routes without Main layout */}
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuDetailsPage />} />

        {/* Routes that require the Main layout */}
        <Route element={<Main />}>
          <Route path="/menu" element={<Menu />} />
        </Route>

        {/* Redirect from unknown routes to / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </div>
);

export default App;
