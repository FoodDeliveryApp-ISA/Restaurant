import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import LeftMenu from "./LeftMenu.tsx";
import RightMenu from "./RightMenu.tsx";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(!visible);
  };

  const { pathname: location } = useLocation();

  useEffect(() => {
    setVisible(false); // Close the drawer on route change
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 h-19 w-full bg-black shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Logo Section */}
        <div className="logo text-lg font-bold text-white">Brand Here</div>

        {/* Desktop Menus */}
        <div className="hidden md:flex items-center gap-4">
          <LeftMenu mode="horizontal" />
          <RightMenu mode="horizontal" />
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden text-white hover:text-gray-300 focus:outline-none"
          type="text"
          onClick={showDrawer}
          icon={<MenuOutlined />}
        />
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title={<span className="text-white">Brand Here</span>}
        placement="right"
        closable={true}
        onClose={showDrawer}
        open={visible}
        className="md:hidden bg-black text-white"
        headerStyle={{ backgroundColor: "black", color: "white" }}
        bodyStyle={{ backgroundColor: "black", color: "white" }}
      >
        <LeftMenu mode="inline" />
        <RightMenu mode="inline" />
      </Drawer>
    </nav>
  );
};

export default Navbar;
