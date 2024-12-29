import React from "react";
import { Modal, Form, Input } from "antd";
import { RequestMenuSaveDto } from "../../../services/dto/menu.dto";

interface AddModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (menuData: RequestMenuSaveDto) => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values: RequestMenuSaveDto) => {
        onSave(values);
        form.resetFields();
      })
      .catch((info) => console.error("Validation failed:", info));
  };

  return (
    <Modal
      title="Add New Menu"
      visible={visible}
      onCancel={onCancel}
      footer={null} // Disable default footer buttons
      className="rounded-lg p-4 bg-white shadow-lg"
      bodyStyle={{ padding: "20px" }} // Extra padding for modal body
    >
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item
          name="menuName"
          label="Menu Name"
          rules={[{ required: true, message: "Please enter the menu name" }]}
        >
          <Input
            placeholder="Enter menu name"
            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
        </Form.Item>
        <Form.Item
          name="menuDescription"
          label="Description"
          rules={[
            { required: true, message: "Please enter the menu description" },
          ]}
        >
          <Input.TextArea
            placeholder="Enter description"
            rows={4}
            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
        </Form.Item>
      </Form>
      <div className="flex justify-end space-x-2 mt-4">
        {/* Single set of action buttons */}
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition"
        >
          Add
        </button>
      </div>
    </Modal>
  );
};

export default AddModal;
