import React from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import authService from "../../../services/auth.service.ts"; // Import authService for logout functionality
import { useNavigate } from "react-router-dom";

const RightMenu = ({ mode }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to profile page
  };

  const handleLogout = async () => {
    try {
      await authService.logout(); // Ensure logout is fully processed
      navigate("/"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally handle or display an error
    }
  };
  

  // Menu items with a black background and white text
  const menuItems = (
    <Menu
      className="bg-black text-white rounded-lg shadow-lg"
      style={{
        backgroundColor: "black", // Background is black
        color: "white", // Text is white
        borderRadius: "8px", // Rounded corners
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)", // Enhanced shadow for depth
      }}
    >
      <Menu.Item
        key="profile"
        icon={<UserOutlined className="text-white text-lg" />}
        onClick={handleProfileClick} // Navigate to profile on click
        className="hover:bg-gray-700 transition duration-300 ease-in-out rounded-lg"
        aria-label="Profile"
      >
        <motion.span
          whileHover={{ scale: 1.05 }} // Scale effect on hover
          className="text-white"
        >
          Profile
        </motion.span>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined className="text-white text-lg" />}
        onClick={handleLogout}
        className="hover:bg-gray-700 transition duration-300 ease-in-out rounded-lg"
        aria-label="Logout"
      >
        <motion.span
          whileHover={{ scale: 1.05 }} // Scale effect on hover
          className="text-white"
        >
          Logout
        </motion.span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`${mode === "horizontal" ? "flex items-center" : "block"}`}>
      <Dropdown overlay={menuItems} trigger={["click"]} placement="bottomRight">
        <div className="flex items-center gap-2 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }} // Scale effect on avatar hover
            transition={{ duration: 0.2 }}
          >
            <Avatar
              icon={<UserOutlined />}
              className="bg-gray-800 text-white border-white transition duration-300 ease-in-out hover:bg-gray-700"
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                backgroundImage: "linear-gradient(45deg, #f6b93b, #6a89cc)", // Gradient background
                cursor: "pointer", // Pointer cursor for better UX
              }}
              aria-label="User Avatar"
            />
          </motion.div>
        </div>
      </Dropdown>
    </div>
  );
};

export default RightMenu;
