import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";

const { TextArea } = Input;

interface EditPageProps {
  menuItemName: string;
  setMenuItemName: (value: string) => void;
  menuItemDescription: string;
  setMenuItemDescription: (value: string) => void;
  menuItemPrice: number | undefined;
  setMenuItemPrice: (value: number | undefined) => void;
  onSave: () => void;
}

const EditPage: React.FC<EditPageProps> = ({
  menuItemName,
  setMenuItemName,
  menuItemDescription,
  setMenuItemDescription,
  menuItemPrice,
  setMenuItemPrice,
  onSave,
}) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Menu Item</h1>
      <Form layout="vertical" onFinish={onSave}>
        <Form.Item label="Name" required>
          <Input
            value={menuItemName}
            onChange={(e) => setMenuItemName(e.target.value)}
            placeholder="Enter menu item name"
          />
        </Form.Item>

        <Form.Item label="Description">
          <TextArea
            value={menuItemDescription}
            onChange={(e) => setMenuItemDescription(e.target.value)}
            rows={4}
            placeholder="Enter menu item description"
          />
        </Form.Item>

        <Form.Item label="Price" required>
          <Input
            type="number"
            value={menuItemPrice}
            onChange={(e) => setMenuItemPrice(Number(e.target.value))}
            placeholder="Enter price"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPage;
