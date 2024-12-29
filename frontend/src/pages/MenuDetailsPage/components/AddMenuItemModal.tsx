import React, { useState } from "react";
import { Modal, Form, Input } from "antd";
import MenuItemService from "../../../services/menuItem.service";
import { RequestMenuItemSaveDto } from "../../../services/dto/menuItem.dto";

interface AddMenuItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (menuData: RequestMenuItemSaveDto) => void;
  menuId: number; // Add menuId as a prop to the modal
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
  visible,
  onCancel,
  onSave,
  menuId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state for API call

  const handleSave = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true); // Set loading state to true
        try {
          const menuItemData: RequestMenuItemSaveDto = values;
          console.log(menuItemData);
          await MenuItemService.createMenuItem(menuId, menuItemData); // Call the service
          form.resetFields(); // Reset form fields after save
          onSave(menuItemData); // Pass data back to parent
        } catch (error) {
          console.error("Error saving menu item:", error);
        } finally {
          setLoading(false); // Reset loading state
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
      className="rounded-lg p-4 bg-white shadow-lg"
      bodyStyle={{ padding: "20px" }}
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
          rules={[
            {
              required: true,
              message: "Please enter the menu item description",
            },
          ]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
        <Form.Item
          name="menuItemPrice"
          label="Price"
          rules={[
            { required: true, message: "Please enter the menu item price" },
          ]}
        >
          <Input type="number" placeholder="Enter menu item price" />
        </Form.Item>
      </Form>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition disabled:bg-gray-300"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
    </Modal>
  );
};

export default AddMenuItemModal;
