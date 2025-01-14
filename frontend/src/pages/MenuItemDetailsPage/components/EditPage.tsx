// EditPage.tsx
import React from "react";
import { Input, Button, Tooltip, Card } from "antd";
import { motion } from "framer-motion";

interface EditPageProps {
  menuItemName: string;
  setMenuItemName: (value: string) => void;
  menuItemDescription: string;
  setMenuItemDescription: (value: string) => void;
  menuItemPrice: number | undefined;
  setMenuItemPrice: (value: number | undefined) => void;
  handleSave: () => void;
  handlePreview: () => void;
}

const EditPage: React.FC<EditPageProps> = ({
  menuItemName,
  setMenuItemName,
  menuItemDescription,
  setMenuItemDescription,
  menuItemPrice,
  setMenuItemPrice,
  handleSave,
  handlePreview,
}) => {
  return (
    <div className="p-6">
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
              </Tooltip>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditPage;
