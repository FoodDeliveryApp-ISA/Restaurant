// Enhanced MenuItemsTable Component with UI/UX Updates
import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Switch } from "antd";
import MenuItemService from "../../../services/menuItem.service";
import { MenuItemDto } from "../../../services/dto/menuItem.dto";
import EmailVerificationPopup from "../../../components/EmailVerificationPopUp";
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
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] =
    useState(false);

  const handleVerificationSuccess = async () => {
    message.info("Verification successful!");
    console.log("Verification successful, proceeding to the next step.");
  };

  const handleResend = async () => {
    console.log("Resending email...");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async delay
    message.info("Resending email verification...");
  };

  // const handleCheckCode = async (): Promise<boolean> => {
  //   message.info("Checking Code...");
  //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async delay
  //   const enteredCode = "111111"; // Replace with actual logic
  //   return enteredCode === "111111";
  // };

  const handleCheckCode = async (): Promise<boolean> => {
    message.info("Checking Code...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get all input elements
    const inputs = document.querySelectorAll('input[type="text"]');

    // Get the value from each input and join them into a single string
    const enteredCode = Array.from(inputs)
      .map((input) => (input as HTMLInputElement).value) // Cast to HTMLInputElement to access .value
      .join(""); // Join the values into a single string

    message.info(`Entered Code: ${enteredCode}`);

    // Check if the entered code matches the correct code
    return enteredCode === "111111"; // Replace with your actual verification code
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await MenuItemService.getAllMenuItems(menuId);
        setMenuItems(items);
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
      await MenuItemService.updateMenuItem(
        menuId,
        updatedItem.menuItemId,
        updatedItem
      );
      handleUpdate(updatedItem);
    } catch (error) {
      message.error("Error toggling active status!");
      console.error("Error toggling active status:", error);
    }
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
            onClick={() => {
              // Trigger email verification popup when View is clicked
              message.info(`Viewing menu item: ${record.menuItemName}`);
              setIsEmailVerificationVisible(true); // Show popup
            }}
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

      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setIsEmailVerificationVisible(false)}
          onResend={handleResend}
          onSend={handleVerificationSuccess}
          onCheck={handleCheckCode} // Pass the onCheck function
          title="Custom Email Verification"
          description="Please enter the verification code to continue."
          successMessage="Thank you for verifying your email!"
          timerDuration={60}
        />
      )}
    </>
  );
};

export default MenuItemsTable;
