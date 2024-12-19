import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App.tsx";
import Navbar from "./components/NavBar";
import FooterView from "./components/Footer/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar /> {/* Navbar is now inside BrowserRouter */}
      <App />
      <FooterView /> {/* FooterView is now inside BrowserRouter */}
    </BrowserRouter>
  </StrictMode>
);
