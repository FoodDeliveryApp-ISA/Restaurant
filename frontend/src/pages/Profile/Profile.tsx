import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert } from "antd";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import LocationSelector from "./LocationSelector";
import RestaurantService from "../../services/restaurant.service"; // Import the RestaurantService

const Profile = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

      {/* Location Selector */}
      {/* <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24}>
          <h2>Select Location</h2>
          <LocationSelector />
        </Col>
      </Row> */}
    </div>
  );
};

export default Profile;
