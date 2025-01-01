import React, { useState } from "react";
import { Table, Button, Switch, message, Empty } from "antd";
import { MenuDto } from "../../../services/dto/menu.dto";

interface MenuTableProps {
  menus: MenuDto[];
  onEdit: (menu: MenuDto) => void;
  onDelete: (menuId: number) => void;
  onView: (menuId: number) => void;
  onToggleActive: (menuId: number, active: boolean) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({
  menus,
  onEdit,
  onDelete,
  onView,
  onToggleActive,
}) => {
  const [editingName, setEditingName] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");

  const handleNameChange = (menuId: number, name: string) => {
    setEditingName(menuId);
    setNewName(name);
  };

  const handleSaveName = async (menuId: number) => {
    if (newName.trim()) {
      console.log("Saving new name:", newName);
      message.success("Menu item name updated successfully!");
      setEditingName(null);
    } else {
      message.error("Menu item name cannot be empty!");
    }
  };

  const columns = [
    {
      title: "Menu Item Name",
      dataIndex: "menuName",
      key: "menuName",
      render: (text: string, record: MenuDto) => (
        <div className="flex items-center">
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "menuDescription",
      key: "menuDescription",
      render: (text: string) => <div className="text-gray-700">{text}</div>,
    },
    {
      title: "Active",
      key: "active",
      render: (_: any, record: MenuDto) => (
        <Switch
          checked={record.active}
          onChange={(checked) => {
            onToggleActive(record.menuId, checked);
          }}
          className="bg-red-600"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MenuDto) => (
        <div className="flex space-x-3">
          <Button
            type="link"
            onClick={() => onEdit(record)}
            className="text-yellow-600 hover:text-yellow-700"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => onDelete(record.menuId)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
          <Button
            type="link"
            onClick={() => onView(record.menuId)}
            className="text-teal-600 hover:text-teal-700"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {console.log("Menus:", menus)}
      {Array.isArray(menus) && menus.length > 0 ? (
        <Table
          dataSource={menus}
          columns={columns}
          rowKey="menuId"
          pagination={false}
          className="rounded-lg bg-white"
        />
      ) : (
        <div className="text-center p-10">
          <Empty description="No menu items available" />
        </div>
      )}
    </div>
  );
};

export default MenuTable;
