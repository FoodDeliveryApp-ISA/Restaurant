import { useState } from "react";
import { Layout, Button } from "antd";
import { useLocation , Outlet} from "react-router-dom";
import Sidenav from "./SideNav";

const { Content, Sider } = Layout;

const Main = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState("#1890ff");

  // Get current pathname
  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  // Toggle visibility of the mobile drawer
  const toggleDrawer = () => setVisible(!visible);

  return (
    <Layout className="flex min-h-screen">
      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white transition-all duration-300 ease-in-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Sidenav color={sidenavColor} />
      </div>

      {/* Sidebar for Desktop */}
      <Sider
        trigger={null}
        width={250}
        theme="light"
        className="hidden md:block bg-white shadow-lg"
      >
        <Sidenav color={sidenavColor} />
      </Sider>

      {/* Main Content Area */}
      <Layout className="w-full">
        <Content className="p-6 md:p-8 bg-gray-100">
          {/* {children} */}
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile Menu Button */}
      <Button
        type="primary"
        onClick={toggleDrawer}
        className="fixed top-6 left-6 z-50 md:hidden"
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
