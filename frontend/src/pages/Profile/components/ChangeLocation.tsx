// components/ChangeLocation.tsx

import React, { useState } from "react";
import { Modal, Form, Button, message } from "antd";
import LocationSelector from "../../../components/LocationSelector"; // Ensure this is your location selector component
import EmailVerificationPopup from "../../../components/EmailVerificationPopup"; // Update path as necessary
import emailVerificationService from "../../../services/emailVerification.service"; // Update path as necessary
import restaurantService from "../../../services/restaurant.service"; // Update path as necessary

interface ChangeLocationProps {
  onLocationChange: (newLocation: string) => void;
  userEmail: string; // Pass the user's email as a prop for verification
}

const ChangeLocation: React.FC<ChangeLocationProps> = ({
  onLocationChange,
  userEmail,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEmailVerificationVisible, setEmailVerificationVisible] =
    useState(false);

  const handleSave = async (values: any) => {
    try {
      const newLocation = values.location;
      console.log("New Location:", newLocation);

      // Call the backend to update the location
      const updatedRestaurant =
        await restaurantService.updateRestaurantLocation(newLocation);

      if (updatedRestaurant) {
        onLocationChange(newLocation); // Callback for location change
        setModalVisible(false); // Close modal after submitting
        setEmailVerificationVisible(true); // Show email verification popup
      } else {
        message.error("Failed to update location. Please try again.");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      message.error("An error occurred while updating the location.");
    }
  };

  const handleVerificationSuccess = async () => {
    setEmailVerificationVisible(false); // Close verification popup

    // Proceed with email update after successful verification
    try {
      const updatedRestaurant = await restaurantService.updateRestaurantEmail(
        userEmail
      );
      if (updatedRestaurant) {
        message.success("Email updated successfully!");
      } else {
        message.error("Failed to update email.");
      }
    } catch (error) {
      message.error("Error during email update.");
    }
  };

  const handleResend = async () => {
    try {
      const dto = { email: userEmail };
      await emailVerificationService.resendVerificationCode(dto);
      message.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      message.error("Failed to resend the verification email.");
    }
  };

  const handleCheckCode = async (): Promise<boolean> => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const verificationCode = Array.from(inputs)
      .map((input) => (input as HTMLInputElement).value)
      .join("")
      .slice(-6);

    try {
      const dto = { email: userEmail, verificationCode };
      await emailVerificationService.verifyUser(dto);
      message.success("Email verified successfully!");
      setEmailVerificationVisible(false); // Close verification popup
      return true;
    } catch (error) {
      message.error("Invalid or expired verification code.");
      return false;
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Change Location
      </Button>
      <Modal
        title="Change Location"
        visible={isModalVisible}
        footer={null} // Remove default footer with OK/Cancel buttons
        onCancel={() => setModalVisible(false)} // Close modal on cancel
      >
        <Form
          onFinish={handleSave} // Use handleSave for form submission
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center the form contents
          }}
        >
          <Form.Item
            label="New Location"
            name="location"
            rules={[{ required: true, message: "Please select a location!" }]}
          >
            <LocationSelector /> {/* LocationSelector as input */}
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginTop: "1rem",
              alignSelf: "center", // Center the button explicitly
            }}
          >
            Save Location
          </Button>
        </Form>
      </Modal>

      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setEmailVerificationVisible(false)}
          onResend={handleResend}
          onCheck={handleCheckCode}
          onSend={handleVerificationSuccess} // Trigger email update after verification
          title="Verify Your Location Update"
          description="Please enter the verification code sent to your email to confirm the location change."
          successMessage="Your location has been successfully updated!"
          timerDuration={60}
        />
      )}
    </>
  );
};

export default ChangeLocation;
