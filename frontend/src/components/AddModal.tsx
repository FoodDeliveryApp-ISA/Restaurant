import React from "react";
import { Modal, Form, Input } from "antd";

interface AddModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (item: { name: string; description: string }) => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((info) => console.error("Validation failed:", info));
  };

  return (
    <Modal
      title="Add New Menu"
      visible={visible}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Add"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the menu name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
