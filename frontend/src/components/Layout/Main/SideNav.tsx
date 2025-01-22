import { Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  UserOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";

interface SidenavProps {
  color: string; // Theme color for the selected item background
}

const Sidenav = ({ color }: SidenavProps) => {
  const { pathname } = useLocation();
  const currentPage = pathname.replace("/", "");

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const isLightColor = (hexColor: string) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200;
  };

  const selectedTextColor = isLightColor(color) ? "text-gray-800" : "text-blue-600";

  const renderMenuItem = (
    key: string,
    icon: React.ReactNode,
    label: string,
    link: string
  ) => (
    <Menu.Item key={key} icon={icon}>
      <NavLink to={link}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`py-2 px-3 rounded-lg text-base font-medium transition-all ${
            currentPage === key
              ? `bg-[${color}] ${selectedTextColor}`
              : "text-gray-700 hover:text-black hover:bg-gray-100"
          }`}
        >
          {!collapsed && label}
        </motion.div>
      </NavLink>
    </Menu.Item>
  );

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`h-full ${collapsed ? "w-20" : "w-72"} p-4 bg-white shadow-md transition-all`}
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="text-center">
          {!collapsed && (
            <>
              <h1 className="text-xl font-semibold text-gray-800">
                Restaurant Panel
              </h1>
              <p className="text-sm text-gray-500">Manage your business</p>
            </>
          )}
        </div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
        />
      </motion.div>

      {/* Menu Sections */}
      <div className="w-full">
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          inlineCollapsed={collapsed}
          style={{ borderRight: 0 }}
        >
          {renderMenuItem("dashboard", <DashboardOutlined />, "Dashboard", "/dashboard")}
          {renderMenuItem("menu", <AppstoreOutlined />, "Menu", "/menu")}
          {renderMenuItem("profile", <UserOutlined />, "Profile", "/profile")}
          {renderMenuItem("orders", <UnorderedListOutlined />, "Orders", "/orders")}
        </Menu>
      </div>
    </motion.div>
  );
};

export default Sidenav;
