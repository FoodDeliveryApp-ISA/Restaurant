import React from "react";
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

  React.useEffect(() => {
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
      title={
        <span className="text-lg font-semibold text-gray-800">Edit Menu</span>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null} // Custom footer with styled buttons
      width={800}
      className="rounded-lg shadow-lg"
      bodyStyle={{ padding: "24px" }}
    >
      <Form form={form} layout="vertical" className="space-y-6">
        <Form.Item
          name="menuName"
          label={
            <span className="text-base font-medium text-gray-700">
              Menu Name
            </span>
          }
          rules={[{ required: true, message: "Please enter the menu name" }]}
        >
          <Input
            placeholder="Enter menu name"
            className="rounded-md border-gray-300 focus:ring-blue-400 focus:ring-2"
          />
        </Form.Item>

        <Form.Item
          name="menuDescription"
          label={
            <span className="text-base font-medium text-gray-700">
              Description
            </span>
          }
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea
            placeholder="Enter description"
            rows={3}
            className="rounded-md border-gray-300 focus:ring-blue-400 focus:ring-2"
          />
        </Form.Item>

        <Form.Item
          name="active"
          label={
            <span className="text-base font-medium text-gray-700">
              Active Status
            </span>
          }
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            className="bg-blue-500"
          />
        </Form.Item>

        {/* Custom Footer */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button
            type="default"
            onClick={onCancel}
            className="px-6 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className="px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
