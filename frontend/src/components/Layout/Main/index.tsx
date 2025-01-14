import { useState } from "react";
import { Layout, Button } from "antd";
import { useLocation, Outlet } from "react-router-dom";
import Sidenav from "./SideNav";

const { Content, Sider } = Layout;

const Main = () => {
  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState("#1890ff");

  // Get current pathname
  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  // Toggle visibility of the mobile drawer
  const toggleDrawer = () => setVisible(!visible);

  return (
    <Layout className="min-h-screen">
      {/* Backdrop for Mobile Drawer */}
      {visible && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleDrawer}
        ></div>
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white transition-transform duration-300 ${
          visible ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Sidenav color={sidenavColor} />
      </div>

      {/* Sidebar for Desktop */}
      <Sider
        trigger={null}
        collapsible
        collapsedWidth={0}
        width={250}
        theme="light"
        className="hidden md:block bg-white shadow-md"
      >
        <Sidenav color={sidenavColor} />
      </Sider>

      {/* Main Content Area */}
      <Layout className="flex-1">
        <Content className="p-4 md:p-8 bg-gray-100">
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile Menu Button */}
      <Button
        type="primary"
        onClick={toggleDrawer}
        className="fixed top-4 left-4 z-50 md:hidden"
        aria-label="Toggle Menu"
        style={{
          backgroundColor: sidenavColor,
          color: "white",
        }}
      >
        Menu
      </Button>
    </Layout>
  );
};

export default Main;
