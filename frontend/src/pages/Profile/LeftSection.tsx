import React, { useState, useEffect } from "react";
import { message, Spin, Divider, Typography } from "antd";
import { motion } from "framer-motion";
import RestaurantService from "../../services/restaurant.service";
import ActiveStatusToggle from "./components/ActiveStatusToggle";
import ProfilePictureUpload from "./components/ProfilePictureUpload";

const { Title } = Typography;

const LeftSection: React.FC = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setIsLoadingData(true);
      try {
        const data = await RestaurantService.getAuthenticatedRestaurant();
        if (data) {
          setRestaurantData(data);
        } else {
          message.error("Failed to load restaurant details.");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        message.error("Error loading restaurant details.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchRestaurantData();
  }, []);

  const updateActiveStatus = async (newStatus: boolean) => {
    try {
      const updatedData = await RestaurantService.updateAuthenticatedRestaurant(
        { ...restaurantData, active: newStatus }
      );
      setRestaurantData(updatedData);
      message.success("Active status updated successfully!");
    } catch (error) {
      message.error("Failed to update active status.");
    }
  };

  const updateProfilePicture = async (newUrl: string) => {
    try {
      const updatedData = await RestaurantService.updateAuthenticatedRestaurant(
        { ...restaurantData, coverImageUrl: newUrl }
      );
      setRestaurantData(updatedData);
      message.success("Profile picture updated successfully!");
    } catch (error) {
      message.error("Failed to update profile picture.");
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin tip="Loading..." />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all max-w-md mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >

      {restaurantData && (
        <>
          <div className="flex flex-col items-center mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            <span className="text-lg text-gray-800 dark:text-gray-300 mb-2">
              Active Status:
            </span>
            <ActiveStatusToggle
              active={restaurantData.active}
              onSave={updateActiveStatus}
            />
          </div>
          <Divider />
          <ProfilePictureUpload
            profilePic={restaurantData.coverImageUrl}
            onUpdate={updateProfilePicture}
          />
        </>
      )}
    </motion.div>
  );
};

export default LeftSection;
