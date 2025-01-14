import React, { useState } from "react";
import { Form, Input, Modal, Button, notification } from "antd";
import MenuItemService from "../../../services/menuItem.service";
import { RequestMenuItemSaveDto } from "../../../services/dto/menuItem.dto";

interface AddMenuItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (menuData: RequestMenuItemSaveDto) => void;
  menuId: number;
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
  visible,
  onCancel,
  onAdd,
  menuId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        try {
          const menuItemData: RequestMenuItemSaveDto = {
            menuItemName: values.menuItemName.trim(),
            menuItemDescription: values.menuItemDescription.trim(),
            menuItemPrice: values.menuItemPrice,
          };
          await MenuItemService.createMenuItem(menuId, menuItemData);
          form.resetFields();
          onAdd(menuItemData);
          notification.success({
            message: "Success",
            description: "Menu item added successfully.",
          });
        } catch (error) {
          console.error("Error saving menu item:", error);
          notification.error({
            message: "Error",
            description: "Failed to save the menu item. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => console.error("Validation failed:", info));
  };

  return (
    <Modal
      title="Add New Menu Item"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="menuItemName"
          label="Menu Item Name"
          rules={[{ required: true, message: "Please enter the menu item name" }]}
        >
          <Input placeholder="Enter menu item name" />
        </Form.Item>
        <Form.Item
          name="menuItemDescription"
          label="Description"
          rules={[{ required: true, message: "Please enter the menu item description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
        <Form.Item
          name="menuItemPrice"
          label="Price"
          rules={[{ required: true, message: "Please enter the menu item price" }]}
        >
          <Input type="number" placeholder="Enter menu item price" />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            Add
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddMenuItemModal;
