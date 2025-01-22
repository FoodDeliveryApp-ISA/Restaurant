import React, { useState, useEffect } from "react";
import { Modal, Button, message, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { motion, useAnimation } from "framer-motion";
import LocationSelector from "../../components/LocationSelector"; // Update path as necessary

const { Text } = Typography;

interface SelectLocationProps {
  onLocationSelected: (location: { lat: number; lng: number }) => void;
}

const SelectLocation: React.FC<SelectLocationProps> = ({ onLocationSelected }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const controls = useAnimation();

  // Idle animation for dragger (jump/flip)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Triggering animation");
      controls.start({
        y: [0, -10, 0], // Jump animation
        rotate: [0, 15, -15, 0], // Flip animation
        transition: {
          duration: 0.6,
          ease: "easeInOut",
        },
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [controls]);
  

  const handleConfirm = () => {
    if (!selectedLocation) {
      message.error("Please select a location.");
      return;
    }
    onLocationSelected(selectedLocation);
    setModalVisible(false);
    message.success("Location selected successfully!");
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        icon={<EnvironmentOutlined />}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "6px",
        }}
      >
        Select Location
      </Button>
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              padding: "8px 16px",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <EnvironmentOutlined style={{ fontSize: "28px", color: "#1890ff" }} />
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
                Choose Location
              </span>
            </div>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Select the best spot for your restaurant on the map below.
            </Text>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        bodyStyle={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
        width={800}
      >
        <Text type="secondary" style={{ textAlign: "center", fontSize: "14px" }}>
          Use the map below to select a location. Drag the pin or click on the map to update your selection.
        </Text>
        <div
          style={{
            width: "100%",
            height: "450px",
            marginBottom: "16px",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <LocationSelector
            onLocationChange={setSelectedLocation}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <motion.div
            animate={controls}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              fontSize: "24px",
              color: "#1890ff",
            }}
          >
            📍
          </motion.div>
        </div>
        {selectedLocation && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "10px",
              background: "#f9f9f9",
              border: "1px solid #e6f7ff",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            <div>
              <Text strong style={{ marginRight: "8px", color: "#1890ff" }}>
                Latitude:
              </Text>
              <Text>{selectedLocation.lat.toFixed(6)}</Text>
            </div>
            <div>
              <Text strong style={{ marginRight: "8px", color: "#1890ff" }}>
                Longitude:
              </Text>
              <Text>{selectedLocation.lng.toFixed(6)}</Text>
            </div>
          </div>
        )}
        <Button
          type="primary"
          onClick={handleConfirm}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
          }}
          disabled={!selectedLocation}
        >
          Confirm Location
        </Button>
      </Modal>
    </>
  );
};

export default SelectLocation;
