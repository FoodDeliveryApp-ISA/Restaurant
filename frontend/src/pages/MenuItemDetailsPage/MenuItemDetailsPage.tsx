import React, { useState } from "react";
import { Button, Input, Card, message, Tooltip } from "antd";
import { motion } from "framer-motion";
import ImageAndActivePage from "./components/ImageAndActivePage";
import EditPage from "./components/EditPage";

const MainPage: React.FC = () => {
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [menuItemName, setMenuItemName] = useState("");
  const [menuItemDescription, setMenuItemDescription] = useState("");
  const [menuItemPrice, setMenuItemPrice] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState("imageAndActive");

  const handleSave = () => {
    if (!menuItemName || menuItemPrice === undefined) {
      message.error("Name and Price are required!");
      return;
    }
    message.success("Menu item saved successfully!");
  };

  const handlePreview = () => {
    if (!menuItemName) {
      message.error("Enter a menu item name to preview!");
      return;
    }
    message.info(`Preview: ${menuItemName} - $${menuItemPrice}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title="Edit Menu Item"
          className="mb-6 shadow-lg"
          bordered={false}
          bodyStyle={{ padding: "20px" }}
        >
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Menu Item Name"
              value={menuItemName}
              onChange={(e) => setMenuItemName(e.target.value)}
            />
            <Input.TextArea
              placeholder="Description"
              rows={3}
              value={menuItemDescription}
              onChange={(e) => setMenuItemDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={menuItemPrice}
              onChange={(e) => setMenuItemPrice(Number(e.target.value))}
            />
            <div className="flex space-x-4">
              <Tooltip title="Save menu item">
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
              </Tooltip>
              <Tooltip title="Preview menu item">
                <Button type="default" onClick={handlePreview}>
                  Preview
                </Button>
              </Tooltip>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ImageAndActivePage
          active={active}
          setActive={setActive}
          images={images}
          setImages={setImages}
        />
      </motion.div>
    </div>
  );
};

export default MainPage;
