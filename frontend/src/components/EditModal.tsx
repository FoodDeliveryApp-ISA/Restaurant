import React from "react";
import { Modal, Input, Form, Table, Button, Space } from "antd";

interface Item {
  key: string;
  name: string;
  description: string;
  active: boolean;
}

interface EditModalProps {
  visible: boolean;
  item: {
    key: string;
    name: string;
    description: string;
    items: Item[];
  } | null;
  onCancel: () => void;
  onSave: (updatedItem: {
    key: string;
    name: string;
    description: string;
    items: Item[];
  }) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  item,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [tableItems, setTableItems] = React.useState<Item[]>([]);

  React.useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
      });
      setTableItems(item.items || []);
    } else {
      form.resetFields();
      setTableItems([]);
    }
  }, [item, form]);

  const toggleActiveStatus = (key: string) => {
    setTableItems((prevItems) =>
      prevItems.map((tableItem) =>
        tableItem.key === key
          ? { ...tableItem, active: !tableItem.active }
          : tableItem
      )
    );
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({
          ...item,
          ...values,
          items: tableItems,
        });
      })
      .catch((info) => console.error("Validation failed:", info));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Active",
      key: "active",
      render: (_: any, record: Item) => (
        <Button
          type={record.active ? "primary" : "default"}
          onClick={() => toggleActiveStatus(record.key)}
        >
          {record.active ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Edit Menu"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      width={800}
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
          <Input.TextArea placeholder="Enter description" rows={3} />
        </Form.Item>
      </Form>

      <h3>Items</h3>
      <Table
        columns={columns}
        dataSource={tableItems}
        rowKey="key"
        pagination={false}
      />
    </Modal>
  );
};

export default EditModal;
