import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import LocationSelector from "../../components/LocationSelector"; // Update path as necessary

interface SelectLocationProps {
  onLocationSelected: (location: { lat: number; lng: number }) => void;
}

const SelectLocation: React.FC<SelectLocationProps> = ({ onLocationSelected }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

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
      <Button type="primary" onClick={() => setModalVisible(true)} className="mb-4">
        Select Location
      </Button>
      <Modal
        title="Select Location"
        open={isModalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        bodyStyle={{ padding: "2rem" }}
      >
        <LocationSelector
          onLocationChange={setSelectedLocation}
        />
        <Button
          type="primary"
          onClick={handleConfirm}
          className="w-full mt-4"
          disabled={!selectedLocation}
        >
          Confirm Location
        </Button>
      </Modal>
    </>
  );
};

export default SelectLocation;
