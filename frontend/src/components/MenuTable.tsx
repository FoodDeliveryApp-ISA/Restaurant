import React from "react";
import { Table, Button, Space } from "antd";

interface Menu {
  key: string;
  name: string;
  description: string;
}

interface MenuTableProps {
  menus: Menu[];
  onEdit: (menu: Menu) => void;
  onDelete: (key: string) => void;
  onView: (key: string) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({
  menus,
  onEdit,
  onDelete,
  onView,
}) => {
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: Menu) => (
        <Space>
          <Button type="link" onClick={() => onView(record.key)}>
            View
          </Button>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.key)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={menus} rowKey="key" />;
};

export default MenuTable;
