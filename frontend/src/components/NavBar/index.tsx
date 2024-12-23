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

  // Check authentication status on component mount and when route changes
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated()); // Use authService to check authentication
  }, [location]); // Add location as a dependency

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
    <nav className="sticky top-0 z-50 w-full bg-black shadow-md">
      <div className="flex justify-between items-center px-6 py-4"> {/* Increased height with py-4 */}
        {/* Logo Section */}
        <div className="logo text-xl font-bold text-white tracking-wide">
          Brand Here
        </div>

        {/* Desktop Menus */}
        <div className="hidden md:flex items-center gap-6">
          <LeftMenu mode="horizontal" />
          {isAuthenticated ? (
            <RightMenu mode="horizontal" onLogout={handleLogout} />
          ) : (
            <div className="flex gap-4">
              <Button
                type="primary"
                onClick={handleLogin}
                className="bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
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
        headerStyle={{
          backgroundColor: "black",
          color: "white",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        }}
        bodyStyle={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        <LeftMenu mode="inline" />
        {isAuthenticated ? (
          <RightMenu mode="inline" onLogout={handleLogout} />
        ) : (
          <div className="flex flex-col gap-4">
            <Button
              type="primary"
              onClick={handleLogin}
              className="bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Login
            </Button>
          </div>
        )}
      </Drawer>
    </nav>
  );
};

export default Navbar;
