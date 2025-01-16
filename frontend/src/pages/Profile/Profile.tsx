import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert, Button, Modal } from "antd";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import LocationSelector from "./LocationSelector";
import RestaurantService from "../../services/restaurant.service"; // Import the RestaurantService

const Profile = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Fetch the authenticated restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        console.log("Fetching authenticated restaurant data...");

        const response = await RestaurantService.getAuthenticatedRestaurant();
        if (!response) {
          throw new Error("No restaurant data found.");
        }

        console.log("Response:", response);
        setRestaurant(response); // Assuming response is the restaurant data
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant(); // Call the fetch function on component mount
  }, []); // Empty dependency array ensures effect runs once on mount

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log("Location selected!");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]} align="top">
        {/* Left Section */}
        <Col xs={24} sm={24} md={10} lg={8}>
          <LeftSection />
        </Col>

        {/* Right Section */}
        <Col xs={24} sm={24} md={14} lg={16}>
          {/* Pass restaurant to RightSection */}
          <RightSection restaurant={restaurant} />
        </Col>
      </Row>

      {/* Location Selector Button */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24}>
          <Button type="primary" onClick={showModal}>
            Select Location
          </Button>
        </Col>
      </Row>

      {/* Modal with Location Selector */}
      <Modal
        title="Select Location"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <LocationSelector />
      </Modal>
    </div>
  );
};

export default Profile;
