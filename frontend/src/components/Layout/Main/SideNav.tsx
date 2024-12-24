import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface SidenavProps {
  color: string;
}

const Sidenav = ({ color }: SidenavProps) => {
  const { pathname } = useLocation();
  const currentPage = pathname.replace("/", "");

  return (
    <div className="h-full flex flex-col items-start p-4 space-y-6 bg-gray-50 shadow-md rounded-lg">
      {/* Dashboard Section */}
      <div className="w-full mb-6 p-4 rounded-lg bg-blue-100 text-blue-700 text-2xl font-bold text-center">
        Dashboard
      </div>

      {/* Menu Section */}
      <div className="w-full border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-gray-600 flex items-center space-x-2 mb-3">
          <AppstoreOutlined />
          <span>Menu</span>
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          className="w-full space-y-2"
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="menu" icon={<FileTextOutlined />}>
            <NavLink to="/menu">
              <span
                className={`block py-2 px-4 rounded-lg text-base font-medium ${
                  currentPage === "menu"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800"
                } hover:bg-gray-200 transition-all`}
              >
                Menu
              </span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="menu-item" icon={<UnorderedListOutlined />}>
            <NavLink to="/menu-item">
              <span
                className={`block py-2 px-4 rounded-lg text-base font-medium ${
                  currentPage === "menu-item"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800"
                } hover:bg-gray-200 transition-all`}
              >
                Menu Items
              </span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>

      {/* Profile Section */}
      <div className="w-full border-t border-gray-200 pt-4 bg-blue-50 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600 flex items-center space-x-2 mb-3">
          <UserOutlined />
          <span>Profile</span>
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          className="w-full space-y-2"
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <NavLink to="/profile">
              <span
                className={`block py-2 px-4 rounded-lg text-base font-medium ${
                  currentPage === "profile"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800"
                } hover:bg-gray-200 transition-all`}
              >
                Profile
              </span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <NavLink to="/logout">
              <span
                className={`block py-2 px-4 rounded-lg text-base font-medium ${
                  currentPage === "logout"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800"
                } hover:bg-gray-200 transition-all`}
              >
                Logout
              </span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>

      {/* Orders Section */}
      <div className="w-full border-t border-gray-200 pt-4 bg-blue-50 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600 flex items-center space-x-2 mb-3">
          <UnorderedListOutlined />
          <span>Orders</span>
        </h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPage]}
          className="w-full space-y-2"
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="orders" icon={<UnorderedListOutlined />}>
            <NavLink to="/orders">
              <span
                className={`block py-2 px-4 rounded-lg text-base font-medium ${
                  currentPage === "orders"
                    ? `bg-[${color}] text-white`
                    : "text-gray-800"
                } hover:bg-gray-200 transition-all`}
              >
                Orders
              </span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Sidenav;
