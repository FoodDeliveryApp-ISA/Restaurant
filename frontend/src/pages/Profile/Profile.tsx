import React from "react";
import { Row, Col } from "antd";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const Profile = () => {
    return (
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]} align="top">
          {/* Left Section */}
          <Col xs={24} sm={24} md={10} lg={8}>
            <LeftSection />
          </Col>
  
          {/* Right Section */}
          <Col xs={24} sm={24} md={14} lg={16}>
            <RightSection />
          </Col>
        </Row>
      </div>
    );
  };

export default Profile;



