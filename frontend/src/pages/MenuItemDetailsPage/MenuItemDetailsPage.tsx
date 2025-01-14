import React, { useEffect, useState } from "react";
import { message } from "antd";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import ImageAndActivePage from "./components/ImageAndActivePage";
import EditPage from "./components/EditPage";
import MenuItemService from "../../services/menuItem.service";

interface Params {
  menuId: string;
  menuItemId: string;
}

const MainPage: React.FC = () => {
  const [active, setActive] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [menuItemName, setMenuItemName] = useState<string>("");
  const [menuItemDescription, setMenuItemDescription] = useState<string>("");
  const [menuItemPrice, setMenuItemPrice] = useState<number | undefined>();
  const { menuId, menuItemId } = useParams<Params>();

  useEffect(() => {
    console.log("Menu id and menu item id :",menuId,menuItemId);
    if (!menuId || !menuItemId) {
      message.error("Invalid menu or menu item ID.");
      return;
    }

    const fetchMenuItem = async () => {
      try {
        const response = await MenuItemService.getMenuItemDetails(
          Number(menuId),
          Number(menuItemId)
        );
        const { menuItemName, menuItemDescription, menuItemPrice , active , imageUrls } = response|| {};
        console.log("responses : ",response);
        setMenuItemName(menuItemName || "");
        setMenuItemDescription(menuItemDescription || "");
        setMenuItemPrice(menuItemPrice || 0);
        setActive(active || false);
        setImageUrls(imageUrls || []);
      } catch (error) {
        console.error("Error fetching menu item:", error);
        message.error("Failed to load menu item. Please try again.");
      }
    };

    fetchMenuItem();
  }, [menuId, menuItemId]);

  const handleSave = async (
    updatedImages = imageUrls,
    updatedActive = active
  ) => {
    if (!menuItemName || menuItemPrice === undefined) {
      message.error("Name and Price are required!");
      return;
    }
  
    const menuItemData = {
      menuItemName,
      menuItemDescription,
      menuItemPrice,
      active: updatedActive, // Use updated active state
      imageUrls: updatedImages, // Use updated images
    };
  
    console.log("Saving Menu Item Data:", menuItemData);
  
    try {
      if (menuItemId) {
        await MenuItemService.updateMenuItem(
          Number(menuId),
          Number(menuItemId),
          menuItemData
        );
      } else {
        await MenuItemService.createMenuItem(Number(menuId), menuItemData);
      }
      message.success("Menu item saved successfully!");
    } catch (error) {
      console.error("Error saving menu item:", error);
      message.error("Failed to save menu item. Try again.");
    }
  };
  
  
  

  const handlePreview = () => {
    if (!menuItemName || menuItemPrice === undefined) {
      message.error("Name and Price are required for preview!");
      return;
    }

    const menuItem = {
      name: menuItemName,
      description: menuItemDescription,
      price: menuItemPrice,
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
          images={imageUrls}
          setImages={setImageUrls}
          menuId={menuId!} // Add non-null assertion if you are sure it's not null/undefined
          menuItemId={menuItemId!}
          handleSave={handleSave} // Ensure this is passed correctly
        />

      </motion.div>
    </div>
  );
};

export default MainPage;
