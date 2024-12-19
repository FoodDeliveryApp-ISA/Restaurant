import React from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { UserOutlined, CodeOutlined, LogoutOutlined } from "@ant-design/icons";

const RightMenu = ({ mode }) => {
  // Menu items with a black background and white text
  const menuItems = (
    <Menu
      className="bg-black text-white"
      style={{
        backgroundColor: "black", // Ensure the background is black
        color: "white", // Ensure text is white
      }}
    >
      <Menu.Item key="project" icon={<CodeOutlined className="text-white" />}>
        <span className="text-white">Projects</span>
      </Menu.Item>
      <Menu.Item key="about-us" icon={<UserOutlined className="text-white" />}>
        <span className="text-white">Profile</span>
      </Menu.Item>
      <Menu.Item key="log-out" icon={<LogoutOutlined className="text-white" />}>
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
