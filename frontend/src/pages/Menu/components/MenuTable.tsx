import React, { useState } from "react";
import { Table, Button, Switch, message, Empty, Tag, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
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
  const columns = [
    {
      title: "Menu Item Name",
      dataIndex: "menuName",
      key: "menuName",
      sorter: (a: MenuDto, b: MenuDto) => a.menuName.localeCompare(b.menuName),
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-blue-600 hover:underline">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "menuDescription",
      key: "menuDescription",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Active",
      key: "active",
      render: (_: any, record: MenuDto) => (
        <Switch
          checked={record.active}
          onChange={(checked) => onToggleActive(record.menuId, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value: boolean, record: MenuDto) => record.active === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MenuDto) => (
        <div className="flex space-x-3">
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.menuId)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onView(record.menuId)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div >
      {menus && menus.length > 0 ? (
        <Table
          dataSource={menus}
          columns={columns}
          rowKey="menuId"
          pagination={{ pageSize: 10 }}
          bordered
        />
      ) : (
        <Empty description="No menu items available" />
      )}
    </div>
  );
};

export default MenuTable;
