import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Navbar from "./components/NavBar";
import FooterView from "./components/Footer/index.tsx";
// import "antd/dist/antd.css";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<LoginRegister />} />
    </Routes>
    <FooterView />
  </Router>
);

export default App;
