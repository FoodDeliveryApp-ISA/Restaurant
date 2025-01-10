import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Switch } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const [currentMenuItemId, setCurrentMenuItemId] = useState<number | null>(
    null
  );
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await MenuItemService.getAllMenuItems(menuId);
        console.log("Fetched menu items:", items);
        setMenuItems(items);
      } catch (error) {
        message.error("Error fetching menu items!");
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, [menuId,menuItems]);

  const handleEdit = (menuItemId: number) => {
    setCurrentMenuItemId(menuItemId);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (menuItem: MenuItemDto) => {
    if (!menuItem.menuItemId) {
      message.error("Invalid menu item ID!");
      return;
    }

    try {
      await MenuItemService.deleteMenuItem(menuId, menuItem.menuItemId);
      setMenuItems(
        menuItems.filter((item) => item.menuItemId !== menuItem.menuItemId)
      );
      message.success("Menu item deleted successfully!");
    } catch (error) {
      message.error("Error deleting menu item!");
      console.error("Error deleting menu item:", error);
    }
  };

  const handleUpdate = (updatedMenuItem: MenuItemDto) => {
    setMenuItems(
      menuItems.map((item) =>
        item.menuItemId === updatedMenuItem.menuItemId ? updatedMenuItem : item
      )
    );
    setIsEditModalVisible(false);
    message.success("Menu item updated successfully!");
  };

  const handleAddMenuItem = (newMenuItem: MenuItemDto) => {
    setMenuItems([...menuItems, newMenuItem]);
    setIsAddModalVisible(false);
    message.success("Menu item added successfully!");
  };

  const toggleActiveStatus = async (menuItem: MenuItemDto) => {
    try {
      const updatedItem = { ...menuItem, active: !menuItem.active };
      console.log("Toggling active status:", updatedItem);
      console.log("Menu Item Id :",menuItem.menuItemId)
      await MenuItemService.updateMenuItem(
        menuId,
        menuItem.menuItemId,
        updatedItem
      );
      handleUpdate(updatedItem);
    } catch (error) {
      message.error("Error toggling active status!");
      console.error("Error toggling active status:", error);
    }
  };

  const handleView = (menuItemId: number) => {
    navigate(`/menu/${menuId}/item/${menuItemId}`); // Navigate to the detailed view
  };

  const columns = [
    { title: "Name", dataIndex: "menuItemName", key: "menuItemName" },
    {
      title: "Description",
      dataIndex: "menuItemDescription",
      key: "menuItemDescription",
    },
    { title: "Price", dataIndex: "menuItemPrice", key: "menuItemPrice" },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active: boolean, record: MenuItemDto) => (
        <Switch checked={active} onChange={() => toggleActiveStatus(record)} />
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (text: string, record: MenuItemDto) => (
        <span>
          <Button
            onClick={() => handleEdit(record.menuItemId)}
            type="primary"
            size="small"
            className="mr-2"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small" className="mr-2">
              Delete
            </Button>
          </Popconfirm>
          <Button
            onClick={() => handleView(record.menuItemId)} // View button handler
            type="default"
            size="small"
          >
            View
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Button
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
          className="mb-4"
        >
          Add Menu Item
        </Button>

        <Table
          rowKey="menuItemId"
          columns={columns}
          dataSource={menuItems}
          pagination={false}
          className="mt-4"
        />
      </div>

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
    </>
  );
};

export default MenuItemsTable;
