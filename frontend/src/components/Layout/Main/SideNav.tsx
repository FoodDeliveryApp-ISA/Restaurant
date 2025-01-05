import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface SidenavProps {
  color: string; // Theme color for the selected item background
}

const Sidenav = ({ color }: SidenavProps) => {
  const { pathname } = useLocation();
  const currentPage = pathname.replace("/", "");

  const isLightColor = (hexColor: string) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200;
  };

  const selectedTextColor = isLightColor(color) ? "text-black" : "text-white";

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
          className={`block py-2 px-4 rounded-lg text-base font-medium transition-all ${
            currentPage === key
              ? `bg-[${color}] ${selectedTextColor}`
              : "text-gray-800 hover:bg-gray-100"
          }`}
        >
          {label}
        </motion.div>
      </NavLink>
    </Menu.Item>
  );

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full max-h-screen flex flex-col p-4 bg-white shadow-lg overflow-y-auto"
    >
      {/* Dashboard Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 p-4 rounded-lg bg-blue-500 text-white text-xl font-bold text-center shadow-sm"
      >
        Dashboard
      </motion.div>

      {/* Menu Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
          <AppstoreOutlined className="mr-2" />
          Menu
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          style={{ borderRight: 0 }}
        >
          {renderMenuItem("menu", <FileTextOutlined />, "Menu", "/menu")}
          {renderMenuItem(
            "menu-item",
            <UnorderedListOutlined />,
            "Menu Items",
            "/menu-item"
          )}
        </Menu>
      </div>

      {/* Profile Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
          <UserOutlined className="mr-2" />
          Profile
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          style={{ borderRight: 0 }}
        >
          {renderMenuItem("profile", <UserOutlined />, "Profile", "/profile")}
          {renderMenuItem("logout", <LogoutOutlined />, "Logout", "/logout")}
        </Menu>
      </div>

      {/* Orders Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
          <UnorderedListOutlined className="mr-2" />
          Orders
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          style={{ borderRight: 0 }}
        >
          {renderMenuItem(
            "orders",
            <UnorderedListOutlined />,
            "Orders",
            "/orders"
          )}
        </Menu>
      </div>
    </motion.div>
  );
};

export default Sidenav;
