import React, { useEffect, useState } from "react";
import { message } from "antd";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom"; // Import useParams
import ImageAndActivePage from "./components/ImageAndActivePage";
import EditPage from "./components/EditPage";
import MenuItemService from "../../services/menuItem.service";

interface Params {
  menuId: string; // Define parameter type for menuId
  menuItemId: string; // Define parameter type for menuItemId
}

const MainPage: React.FC = () => {
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [menuItemName, setMenuItemName] = useState<string>("");
  const [menuItemDescription, setMenuItemDescription] = useState<string>("");
  const [menuItemPrice, setMenuItemPrice] = useState<number | undefined>();
  const { menuId, menuItemId } = useParams<Params>(); // Get menuId and menuItemId from URL params

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await MenuItemService.getMenuItemDetails(
          Number(menuId), // Convert menuId to number
          Number(menuItemId) // Convert menuItemId to number
        );

        // Ensure that response.data is destructured correctly based on your API response
        const { menuItemName, menuItemDescription, menuItemPrice } = response;

        // Set the state with the fetched data
        setMenuItemName(menuItemName);
        setMenuItemDescription(menuItemDescription);
        setMenuItemPrice(menuItemPrice);
      } catch (error) {
        console.error("Error fetching menu item:", error);
        message.error("Failed to load menu item. Please try again.");
      }
    };

    fetchMenuItem();
  }, [menuId, menuItemId]); // Run when menuId or menuItemId changes

  const handleSave = async () => {
    if (!menuItemName || menuItemPrice === undefined) {
      message.error("Name and Price are required!");
      return;
    }

    const menuItemData = {
      menuItemName, // Use the property names from your DTO
      menuItemDescription,
      menuItemPrice,
    };

    try {
      await MenuItemService.createMenuItem(Number(menuId), menuItemData); // Convert menuId to number
      message.success("Menu item saved successfully!");
    } catch (error) {
      console.error("Error saving menu item:", error);
      message.error("Failed to save menu item. Try again.");
    }
  };

  const handlePreview = () => {
    if (!menuItemName) {
      message.error("Enter a menu item name to preview!");
      return;
    }

    const menuItem = {
      name: menuItemName,
      description: menuItemDescription,
      price: menuItemPrice || 0,
    };

    message.info(`Preview: ${menuItem.name} - $${menuItem.price}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <EditPage
        menuItemName={menuItemName}
        setMenuItemName={setMenuItemName}
        menuItemDescription={menuItemDescription}
        setMenuItemDescription={setMenuItemDescription}
        menuItemPrice={menuItemPrice}
        setMenuItemPrice={setMenuItemPrice}
        handleSave={handleSave}
        handlePreview={handlePreview}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ImageAndActivePage
          active={active}
          setActive={setActive}
          images={images}
          setImages={setImages}
        />
      </motion.div>
    </div>
  );
};

export default MainPage;
