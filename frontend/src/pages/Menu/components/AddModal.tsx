import React from "react";
import { Modal, Form, Input, Button } from "antd";
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
      footer={null} // Custom footer
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="menuName"
          label="Menu Name"
          rules={[{ required: true, message: "Please enter the menu name" }]}
        >
          <Input placeholder="Enter menu name" />
        </Form.Item>
        <Form.Item
          name="menuDescription"
          label="Description"
          rules={[{ required: true, message: "Please enter the menu description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Add
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
