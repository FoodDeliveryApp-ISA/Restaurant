import { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import { useLocation, Outlet } from "react-router-dom";
import Sidenav from "./SideNav";

const { Content, Sider } = Layout;

const Main = () => {
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  const handleDrawerToggle = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <Layout className="min-h-screen relative w-0px">
      {/* Sidenav for larger screens */}
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

      {/* Sidenav Drawer for mobile screens */}
      <Drawer
        placement="left"
        closable={false}
        onClose={handleDrawerToggle}
        visible={isDrawerVisible}
        width={250}
        bodyStyle={{ padding: 0 }}
        zIndex={1000}
      >
        <Sidenav color={sidenavColor} />
      </Drawer>

      {/* Dimmed Overlay when Drawer is open */}
      {isDrawerVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={handleDrawerToggle}
        ></div>
      )}

      {/* Main Content Area */}
      <Layout
        className={`flex-1 transition-all duration-300 ${
          isDrawerVisible ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {/* Button to toggle Sidenav in mobile view */}
        <Button
          className="md:hidden absolute top-4 left-4 z-10"
          type="primary"
          onClick={handleDrawerToggle}
        >
          Menu
        </Button>
        <Content className="p-4 md:p-8 bg-gray-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
