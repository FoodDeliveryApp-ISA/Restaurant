import React, { useEffect } from "react";
import { Modal, Input, Form, Switch, Button } from "antd";
import { MenuDto, RequestUpdatedMenuDto } from "../../../services/dto/menu.dto";

interface EditModalProps {
  visible: boolean;
  item: MenuDto | null;
  onCancel: () => void;
  onSave: (updatedMenu: RequestUpdatedMenuDto & { menuId: number }) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  item,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        menuName: item.menuName,
        menuDescription: item.menuDescription,
        active: item.active,
      });
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values: RequestUpdatedMenuDto) => {
        onSave({ ...values, menuId: item!.menuId });
      })
      .catch((info) => console.error("Validation failed:", info));
  };

  return (
    <Modal
      title="Edit Menu"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
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
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea
            placeholder="Enter description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="active"
          label="Active Status"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </Form.Item>

        {/* Footer */}
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={onCancel}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
