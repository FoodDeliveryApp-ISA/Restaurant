import React from "react";
import { Table, Button } from "antd";

interface MenuItem {
  key: string;
  name: string;
  description: string;
  active: boolean;
}

interface MenuItemsTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (key: string) => void;
  onToggleActive: (key: string) => void;
}

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  onEdit,
  onDelete,
  onToggleActive,
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
      title: "Active",
      key: "active",
      render: (_: any, record: MenuItem) => (
        <Button
          type={record.active ? "primary" : "default"}
          onClick={() => onToggleActive(record.key)}
        >
          {record.active ? "Active" : "Inactive"}
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MenuItem) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit Description
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.key)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={items} rowKey="key" />;
};

export default MenuItemsTable;
