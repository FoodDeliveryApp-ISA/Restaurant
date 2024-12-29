// MenuTableColumns.ts
import React from "react";
import { Button, Switch } from "antd";
import { MenuItemDto } from "../../../services/dto/menuItem.dto";

export const getMenuColumns = (
  handleEdit: (menuItemId: number) => void,
  handleDelete: (menuItem: MenuItemDto) => void,
  toggleActiveStatus: (menuItem: MenuItemDto) => void
) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (price: number) => `$${price.toFixed(2)}`,
  },
  {
    title: "Active",
    dataIndex: "active",
    key: "active",
    render: (active: boolean, menuItem: MenuItemDto) => (
      <Switch checked={active} onChange={() => toggleActiveStatus(menuItem)} />
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_: any, menuItem: MenuItemDto) => (
      <>
        <Button onClick={() => handleEdit(menuItem.menuItemId)}>Edit</Button>
        <Button
          onClick={() => handleDelete(menuItem)}
          danger
          style={{ marginLeft: 8 }}
        >
          Delete
        </Button>
      </>
    ),
  },
];
