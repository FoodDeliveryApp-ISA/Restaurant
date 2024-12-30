// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Main from "./components/Layout/Main";
import { publicRoutes, privateRoutes } from "./routes/routes";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route element={<Main />}>
            {/* Private Routes */}
            {privateRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<PrivateRoute element={element} />}
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
