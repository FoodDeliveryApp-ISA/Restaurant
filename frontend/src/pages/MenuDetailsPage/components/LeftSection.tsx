import React, { useState, useEffect } from "react";
import { message, Spin, Divider, Typography } from "antd";
import { motion } from "framer-motion";
import MenuService from "../../../services/menu.service";
import ActiveStatusToggle from "./ActiveStatusToggle";
import MenuPictureUpload from "./MenuPictureUpload";

const { Title } = Typography;

interface LeftSectionProps {
  menuId: number; // menuId passed as a prop to fetch specific menu data
}

const LeftSection: React.FC<LeftSectionProps> = ({ menuId }) => {
  const [menuData, setMenuData] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      setIsLoadingData(true);
      try {
        const data = await MenuService.getMenuById(menuId); // Fetch menu by ID
        console.log("Fetched menu data:", data);
        if (data) {
          setMenuData(data);
        } else {
          setErrorMessage("No menu data found.");
        }
      } catch (error: any) {
        console.error("Error fetching menu data:", error);
        setErrorMessage("Failed to load menu data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (menuId) {
      fetchMenuData(); // Fetch the menu data if menuId is provided
    } else {
      setErrorMessage("Menu ID is required.");
      setIsLoadingData(false);
    }
  }, [menuId]); // Re-fetch when menuId changes

  useEffect(() => {
    if (menuData) {
      console.log("Menu Data Updated:", menuData);
      console.log("Menu coverImageUrl:", menuData.coverImageUrl);
    }
  }, [menuData]);

  const updateActiveStatus = async (newStatus: boolean) => {
    if (!menuData) return; // Ensure menuData is available
    try {
      const updatedMenuData = await MenuService.updateMenu(menuData.menuId, {
        active: newStatus,
      });
      setMenuData(updatedMenuData);
      message.success("Menu active status updated successfully!");
    } catch (error) {
      message.error("Failed to update active status.");
    }
  };

  const updateMenuPicture = async (newUrl: string) => {
    if (!menuData) return; // Ensure menuData is available
    try {
      const updatedMenuData = await MenuService.updateMenu(menuData.menuId, {
        coverImageUrl: newUrl,
      });
      setMenuData(updatedMenuData);
      message.success("Menu picture updated successfully!");
    } catch (error) {
      message.error("Failed to update menu picture.");
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin tip="Loading..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center mt-6">
        <Typography.Text type="danger">{errorMessage}</Typography.Text>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all max-w-md mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {menuData && (
        <>
          <div className="flex flex-col items-center mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            <span className="text-lg text-gray-800 dark:text-gray-300 mb-2">
              Menu Active Status:
            </span>
            <ActiveStatusToggle
              active={menuData.active}
              onSave={updateActiveStatus}
            />
          </div>
          <Divider />
          <MenuPictureUpload
            avatarUrl={menuData?.coverImageUrl}
            onUpdate={updateMenuPicture}
          />
        </>
      )}
    </motion.div>
  );
};

export default LeftSection;
