import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import MenuItemService from "../../../services/menuItem.service";
import {
  MenuItemDto,
  RequestUpdatedMenuItemDto,
} from "../../../services/dto/menuItem.dto";

interface EditMenuItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (menuItem: MenuItemDto) => void;
  menuId: number;
  menuItemId: number;
}

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  visible,
  onCancel,
  onUpdate,
  menuId,
  menuItemId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (menuId && menuItemId) {
      const fetchMenuItem = async () => {
        setLoading(true);
        try {
          const fetchedMenuItem = await MenuItemService.getMenuItemById(
            menuId,
            menuItemId
          );
          form.setFieldsValue(fetchedMenuItem);
        } catch (error) {
          console.error("Error fetching menu item:", error);
          message.error("Failed to load menu item details.");
        } finally {
          setLoading(false);
        }
      };
      fetchMenuItem();
    }
  }, [visible, menuId, menuItemId]);

  const handleSave = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        try {
          const updatedMenuItemData: RequestUpdatedMenuItemDto = values;
          const updatedMenuItem = await MenuItemService.updateMenuItem(
            menuId,
            menuItemId,
            updatedMenuItemData
          );
          onUpdate(updatedMenuItem);
          onCancel();
        } catch (error) {
          console.error("Error updating menu item:", error);
          message.error("Failed to update menu item. Please try again.");
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => console.error("Validation failed:", info));
  };

  return (
    <Modal
      title="Edit Menu Item"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={loading}
      okText="Update"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item
          name="menuItemName"
          label="Menu Item Name"
          rules={[
            { required: true, message: "Please enter the menu item name" },
          ]}
        >
          <Input placeholder="Enter menu item name" />
        </Form.Item>
        <Form.Item
          name="menuItemDescription"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
        <Form.Item
          name="menuItemPrice"
          label="Price"
          rules={[
            { required: true, message: "Please enter the menu item price" },
            {
              type: "number",
              min: 0,
              message: "Price must be a positive value",
            },
          ]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMenuItemModal;
