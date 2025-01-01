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
  color: string;
}

const Sidenav = ({ color }: SidenavProps) => {
  const { pathname } = useLocation();
  const currentPage = pathname.replace("/", "");

  const motionVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="h-full flex flex-col items-start p-6 space-y-8 bg-gray-50 shadow-lg rounded-xl">
      {/* Dashboard Section */}
      <div className="w-full mb-6 p-4 rounded-lg bg-blue-100 text-blue-700 text-2xl font-bold text-center shadow-sm">
        Dashboard
      </div>

      {/* Menu Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-gray-600 flex items-center space-x-2 mb-4">
          <AppstoreOutlined />
          <span>Menu</span>
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="menu" icon={<FileTextOutlined />}>
            <NavLink to="/menu">
              <motion.span
                variants={motionVariants}
                whileHover="hover"
                whileTap="tap"
                className={`block py-2 px-4 rounded-lg text-base font-medium transition-all ${
                  currentPage === "menu"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Menu
              </motion.span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="menu-item" icon={<UnorderedListOutlined />}>
            <NavLink to="/menu-item">
              <motion.span
                variants={motionVariants}
                whileHover="hover"
                whileTap="tap"
                className={`block py-2 px-4 rounded-lg text-base font-medium transition-all ${
                  currentPage === "menu-item"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Menu Items
              </motion.span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>

      {/* Profile Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-blue-600 flex items-center space-x-2 mb-4">
          <UserOutlined />
          <span>Profile</span>
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <NavLink to="/profile">
              <motion.span
                variants={motionVariants}
                whileHover="hover"
                whileTap="tap"
                className={`block py-2 px-4 rounded-lg text-base font-medium transition-all ${
                  currentPage === "profile"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Profile
              </motion.span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <NavLink to="/logout">
              <motion.span
                variants={motionVariants}
                whileHover="hover"
                whileTap="tap"
                className={`block py-2 px-4 rounded-lg text-base font-medium transition-all ${
                  currentPage === "logout"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Logout
              </motion.span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>

      {/* Orders Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-blue-600 flex items-center space-x-2 mb-4">
          <UnorderedListOutlined />
          <span>Orders</span>
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="orders" icon={<UnorderedListOutlined />}>
            <NavLink to="/orders">
              <motion.span
                variants={motionVariants}
                whileHover="hover"
                whileTap="tap"
                className={`block py-2 px-4 rounded-lg text-base font-medium transition-all ${
                  currentPage === "orders"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Orders
              </motion.span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Sidenav;
