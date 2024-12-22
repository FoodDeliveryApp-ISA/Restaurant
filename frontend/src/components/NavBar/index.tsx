import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import LeftMenu from "./LeftMenu.tsx";
import RightMenu from "./RightMenu.tsx";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service.ts"; // Import authService

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const navigate = useNavigate(); // Hook for navigation
  const { pathname: location } = useLocation();

  const showDrawer = () => {
    setVisible(!visible);
  };

  // Check authentication status on component mount
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated()); // Use authService to check authentication
  }, []);

  useEffect(() => {
    setVisible(false); // Close the drawer on route change
  }, [location]);

  const handleLogin = () => {
    authService.login(); // Simulate login via authService
    setIsAuthenticated(true); // Update authentication state
    navigate("/"); // Navigate to home page
  };

  const handleLogout = () => {
    authService.logout(); // Simulate logout via authService
    setIsAuthenticated(false); // Update authentication state
    navigate("/login"); // Navigate to login page
  };

  return (
    <nav className="sticky top-0 z-50 h-19 w-full bg-black shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Logo Section */}
        <div className="logo text-lg font-bold text-white">Brand Here</div>

        {/* Desktop Menus */}
        <div className="hidden md:flex items-center gap-4">
          <LeftMenu mode="horizontal" />
          {isAuthenticated ? (
            <RightMenu mode="horizontal" onLogout={handleLogout} />
          ) : (
            <div className="flex gap-2">
              <Button type="primary" onClick={handleLogin}>
                Login
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden text-white hover:text-gray-300 focus:outline-none"
          type="text"
          onClick={showDrawer}
          icon={<MenuOutlined />}
        />
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title={<span className="text-white">Brand Here</span>}
        placement="right"
        closable={true}
        onClose={showDrawer}
        open={visible}
        className="md:hidden bg-black text-white"
        headerStyle={{ backgroundColor: "black", color: "white" }}
        bodyStyle={{ backgroundColor: "black", color: "white" }}
      >
        <LeftMenu mode="inline" />
        {isAuthenticated ? (
          <RightMenu mode="inline" onLogout={handleLogout} />
        ) : (
          <div className="flex flex-col gap-2">
            <Button type="primary" onClick={handleLogin}>
              Login
            </Button>
          </div>
        )}
      </Drawer>
    </nav>
  );
};

export default Navbar;
