import React, { useState, useEffect } from "react";
import { Spin, Divider, Typography, message, Card } from "antd";
import { motion } from "framer-motion";
import MenuService from "../../../services/menu.service";
import ActiveStatusToggle from "./ActiveStatusToggle";
import MenuPictureUpload from "./MenuPictureUpload";

const { Text, Title } = Typography;

interface LeftSectionProps {
  menuId: number;
}

const LeftSection: React.FC<LeftSectionProps> = ({ menuId }) => {
  const [menuData, setMenuData] = useState<any | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      setIsLoadingData(true);
      try {
        const data = await MenuService.getMenuById(menuId);
        if (data) {
          setMenuData(data);
        } else {
          setErrorMessage("No menu data found.");
        }
      } catch (error: any) {
        setErrorMessage("Failed to load menu data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (menuId) {
      fetchMenuData();
    } else {
      setErrorMessage("Menu ID is required.");
      setIsLoadingData(false);
    }
  }, [menuId]);

  const updateActiveStatus = async (newStatus: boolean) => {
    if (!menuData) return;
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
    if (!menuData) return;
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
        <Spin tip="Loading..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Text type="danger">{errorMessage}</Text>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
      >
        {menuData && (
          <>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Active Status:</Text>
              <div style={{ marginTop: "8px" }}>
                <ActiveStatusToggle
                  active={menuData.active}
                  onSave={updateActiveStatus}
                />
              </div>
            </div>
            <Divider />
            <MenuPictureUpload
              avatarUrl={menuData?.coverImageUrl}
              onUpdate={updateMenuPicture}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LeftSection;
