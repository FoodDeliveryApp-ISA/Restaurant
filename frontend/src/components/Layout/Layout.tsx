// components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../NavBar";
import Footer from "../Footer";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        {/* This will render the child route */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
