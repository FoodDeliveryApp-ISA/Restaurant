import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Switch, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MenuItemService from "../../../services/menuItem.service";
import { MenuItemDto } from "../../../services/dto/menuItem.dto";
import EditMenuItemModal from "./EditMenuItemModal";
import AddMenuItemModal from "./AddMenuItemModal";

interface MenuItemsTableProps {
  menuId: number;
}

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({ menuId }) => {
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentMenuItemId, setCurrentMenuItemId] = useState<number | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await MenuItemService.getAllMenuItems(menuId);
        console.log(menuId);
        console.log("Fetched menu items:", items); // Debug
        setMenuItems(items || []);
      } catch (error) {
        message.error("Error fetching menu items!");
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, [menuId]);
  
  

  const handleEdit = (menuItemId: number) => {
    setCurrentMenuItemId(menuItemId);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (menuItem: MenuItemDto) => {
    try {
      await MenuItemService.deleteMenuItem(menuId, menuItem.menuItemId);
      setMenuItems((prev) => prev.filter((item) => item.menuItemId !== menuItem.menuItemId));
      message.success("Menu item deleted successfully!");
    } catch (error) {
      message.error("Error deleting menu item!");
      console.error(error);
    }
  };

  const handleUpdate = (updatedMenuItem: MenuItemDto) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.menuItemId === updatedMenuItem.menuItemId ? updatedMenuItem : item
      )
    );
    setIsEditModalVisible(false);
    message.success("Menu item updated successfully!");
  };

  const handleAddMenuItem = (newMenuItem: MenuItemDto) => {
    setMenuItems((prev) => [newMenuItem, ...prev]);
    setIsAddModalVisible(false);
    message.success("Menu item added successfully!");
  };

  const toggleActiveStatus = async (menuItem: MenuItemDto) => {
    try {
      const updatedItem = { ...menuItem, active: !menuItem.active };
      await MenuItemService.updateMenuItem(menuId, menuItem.menuItemId, updatedItem);
      handleUpdate(updatedItem);
    } catch (error) {
      message.error("Error toggling active status!");
      console.error(error);
    }
  };

  const handleView = (menuItemId: number | undefined) => {
    if (!menuItemId) {
      message.error("Invalid menu item ID");
      return;
    }
    console.log("Navigating to menu item:", menuId, menuItemId);
    navigate(`/menu/${menuId}/item/${menuItemId}`);
  };
  

  const columns = [
    {
      title: "Name",
      dataIndex: "menuItemName",
      key: "menuItemName",
      sorter: (a: MenuItemDto, b: MenuItemDto) => a.menuItemName.localeCompare(b.menuItemName),
    },
    {
      title: "Description",
      dataIndex: "menuItemDescription",
      key: "menuItemDescription",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "menuItemPrice",
      key: "menuItemPrice",
      sorter: (a: MenuItemDto, b: MenuItemDto) => a.menuItemPrice - b.menuItemPrice,
      render: (price: number | null | undefined) => {
        if (typeof price === "number") {
          return `$${price.toFixed(2)}`;
        }
        return `$0.00`; // Default display for invalid or missing price
      },
      
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value: boolean, record: MenuItemDto) => record.active === value,
      render: (active: boolean, record: MenuItemDto) => (
        <Switch checked={active} onChange={() => toggleActiveStatus(record)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: MenuItemDto) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record.menuItemId)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record.menuItemId)} />
          </Tooltip>
        </div>
      ),      
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsAddModalVisible(true)}
        style={{ marginBottom: "16px" }}
      >
        Add Menu Item
      </Button>
      <Table
        rowKey="menuItemId"
        columns={columns}
        dataSource={menuItems}
        pagination={{ pageSize: 5 }}
        bordered
      />
      {isEditModalVisible && currentMenuItemId && (
        <EditMenuItemModal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onUpdate={handleUpdate}
          menuId={menuId}
          menuItemId={currentMenuItemId}
        />
      )}
      {isAddModalVisible && (
        <AddMenuItemModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          onAdd={handleAddMenuItem}
          menuId={menuId}
        />
      )}
    </div>
  );
};

export default MenuItemsTable;
