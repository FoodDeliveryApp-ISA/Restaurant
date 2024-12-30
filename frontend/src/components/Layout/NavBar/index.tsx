import React, { useEffect, useState, useCallback } from "react";
import { Drawer, Button, Tooltip } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import LeftMenu from "./LeftMenu.tsx";
import RightMenu from "./RightMenu.tsx";
import HeaderNoticeComponent from "./Notifications.tsx"; // Notifications component
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../../services/auth.service.ts"; // Import authService

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const navigate = useNavigate(); // Hook for navigation
  const { pathname: location } = useLocation();

  const showDrawer = () => {
    setVisible((prev) => !prev);
  };

  // Check authentication status on component mount and when route changes
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated()); // Use authService to check authentication
  }, [location]); // Add location as a dependency

  useEffect(() => {
    setVisible(false); // Close the drawer on route change
  }, [location]);

  const handleLogin = useCallback(() => {
    authService.login(); // Simulate login via authService
    setIsAuthenticated(true); // Update authentication state
    navigate("/"); // Navigate to home page
  }, [navigate]);

  const handleLogout = useCallback(() => {
    authService.logout(); // Simulate logout via authService
    setIsAuthenticated(false); // Update authentication state
    navigate("/login"); // Navigate to login page
  }, [navigate]);

  const drawerStyle = {
    backgroundColor: "black",
    color: "white",
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo Section */}
        <div className="logo text-xl font-bold text-white tracking-wide">
          Brand Here
        </div>
        {/* Desktop Menus */}
        <div className="hidden md:flex items-center gap-6">
          {/* Notification Icon - Render only if authenticated */}
          {isAuthenticated && <HeaderNoticeComponent />}
          <LeftMenu mode="horizontal" />
          {isAuthenticated && (
            <RightMenu mode="horizontal" onLogout={handleLogout} />
          )}
        </div>
        {/* Mobile Menu Button */}
        <Button
          className="md:hidden text-white hover:text-gray-300 focus:outline-none"
          type="text"
          onClick={showDrawer}
          icon={<MenuOutlined />}
          aria-label="Toggle mobile menu"
        />
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title={<span className="text-white">Brand Here</span>}
        placement="right"
        closable={true}
        onClose={showDrawer}
        open={visible}
        className="md:hidden"
        headerStyle={drawerStyle}
        bodyStyle={{ backgroundColor: "black", color: "white" }}
      >
        <LeftMenu mode="inline" />
        {isAuthenticated && <RightMenu mode="inline" onLogout={handleLogout} />}
      </Drawer>
    </nav>
  );
};

export default Navbar;
