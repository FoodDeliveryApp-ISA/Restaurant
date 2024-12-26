import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert } from "antd";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import AuthService from "../../services/restaurant.service"; // Import the AuthService

const Profile = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Fetch the restaurant data when the restaurantId is set
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        console.log("Fetching restaurant data...");
        if (!restaurantId) {
          throw new Error("Restaurant ID is missing.");
        }

        const response = await AuthService.getRestaurantById(restaurantId); // Use the correct restaurantId
        console.log("Response:", response.data);
        setRestaurant(response.data); // Assuming response.data is the restaurant data
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    // Ensure fetchRestaurant is called only when restaurantId is available
    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]); // Dependency array ensures effect runs when restaurantId changes

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    // Manually set restaurantId to "1" for testing
    setRestaurantId(storedRestaurantId);
  }, []); // Empty dependency array to run once when the component mounts

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
    </div>
  );
};

export default Profile;
