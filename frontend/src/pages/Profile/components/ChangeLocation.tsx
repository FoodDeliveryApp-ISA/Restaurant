import React, { useState } from "react";
import { Modal,  Button, message } from "antd";
import LocationSelector from "../../../components/LocationSelector"; // Update path as necessary
import EmailVerificationPopup from "../../../components/EmailVerificationPopup"; // Update path as necessary
import restaurantService from "../../../services/restaurant.service"; // Update path as necessary
import emailVerificationService from "../../../services/emailVerification.service"; // Update path as necessary

interface RestaurantResponseDto {
  restaurantId: number;
  restaurantName: string;
  restaurantEmail: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  active: boolean;
  coverImageUrl: string;
}

interface VerifyEmailDto {
  email: string;
  verificationCode: string;
}

interface ChangeLocationProps {
  restaurant: RestaurantResponseDto | null;
}

const ChangeLocation: React.FC<ChangeLocationProps> = ({ restaurant }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] = useState(false);
  const [newLocation, setNewLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!restaurant || !newLocation) {
      message.error("No restaurant information or location available.");
      return;
    }

    try {
      const locationString = `${newLocation.lat},${newLocation.lng}`;
      const updatedRestaurant = await restaurantService.updateAuthenticatedRestaurant({
        ...restaurant,
        restaurantLocation: locationString,
      });

      if (updatedRestaurant) {
        message.success("Location updated successfully!");
        setModalVisible(false);
      } else {
        message.error("Failed to update location. Please try again.");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      message.error("An error occurred while updating the location.");
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      await handleSave();
      setIsEmailVerificationVisible(false);
    } catch (error) {
      message.error("Failed to save changes after verification.");
    }
  };

  const handleSendCode = async () => {
    const email = restaurant?.restaurantEmail;
    if (!email) {
      message.error("Email is required to send a verification code.");
      return;
    }

    try {
      setLoading(true);
      await emailVerificationService.requestVerificationCode({ email });
      message.success("Verification email sent. Please check your inbox.");
      setIsEmailVerificationVisible(true);
    } catch (error) {
      message.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = restaurant?.restaurantEmail;
    if (!email) {
      message.error("Email is required to resend the verification code.");
      return;
    }

    try {
      await emailVerificationService.resendVerificationCode({ email });
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
        .slice(-6); // Ensure only the last 6 characters are used
  
      try {
        const dto: VerifyEmailDto = {
          email: restaurant.restaurantEmail,
          verificationCode,
        };
        console.log(restaurant);
        console.log(dto);
        await emailVerificationService.verifyUser(dto);
        console.log(dto);
        await handleVerificationSuccess();
        return true;
      } catch (error) {
        message.error("Invalid or expired verification code.");
        return false;
      }
    };

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)} className="mb-4">
        Change Location
      </Button>
      <Modal
        title="Change Location"
        open={isModalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        bodyStyle={{ padding: "2rem" }}
      >
        <LocationSelector
          restaurantLocation={restaurant?.restaurantLocation}
          onLocationChange={setNewLocation}
        />
        <Button
          type="primary"
          onClick={handleSendCode}
          className="w-full mt-4"
          disabled={!newLocation}
          loading={loading}
        >
          Verify and Save Location
        </Button>
      </Modal>
      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onSend={handleSendCode}
          onClose={() => setIsEmailVerificationVisible(false)}
          onResend={handleResend}
          onCheck={handleCheckCode}
          title="Verify Your Email"
          description="Enter the verification code sent to your email to confirm the changes."
        />
      )}
    </>
  );
};

export default ChangeLocation;
