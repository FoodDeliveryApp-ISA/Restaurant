import React from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import authService from "../../services/auth.service.ts"; // Import authService for logout functionality
import { useNavigate } from "react-router-dom";

const RightMenu = ({ mode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(); // Clear authentication state
    navigate("/"); // Redirect to login page after logout
  };

  // Menu items with a black background and white text
  const menuItems = (
    <Menu
      className="bg-black text-white"
      style={{
        backgroundColor: "black", // Background is black
        color: "white", // Text is white
      }}
    >
      <Menu.Item key="profile" icon={<UserOutlined className="text-white" />}>
        <span className="text-white">Profile</span>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined className="text-white" />}
        onClick={handleLogout}
      >
        <span className="text-white">Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`${mode === "horizontal" ? "flex items-center" : ""}`}>
      <Dropdown overlay={menuItems} trigger={["click"]} placement="bottomRight">
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar
            icon={<UserOutlined />}
            className="bg-gray-800 text-white border-white"
          />
        </div>
      </Dropdown>
    </div>
  );
};

export default RightMenu;
