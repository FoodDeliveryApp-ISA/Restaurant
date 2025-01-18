import React, { useState } from "react";
import { Modal, Form, Button, Input, message } from "antd";
import EmailVerificationPopup from "../../../components/EmailVerificationPopup"; // Update path as necessary
import restaurantService from "../../../services/restaurant.service"; // Update path as necessary
import emailVerificationService from "../../../services/emailVerification.service"; // Update path as necessary
import {
    RequestVerificationDto,
    VerifyEmailDto,
  } from "../../../services/dto/emailVerification.dto";

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

interface ChangeEmailProps {
  restaurant: RestaurantResponseDto | null;
}

const ChangeEmail: React.FC<ChangeEmailProps> = ({ restaurant }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] = useState(false);
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerificationSuccess = async () => {
    if (!restaurant || !newEmail) {
      message.error("No restaurant information or new email provided.");
      return;
    }

    try {
      const updatedRestaurant = await restaurantService.updateAuthenticatedRestaurant({
        ...restaurant,
        restaurantEmail: newEmail,
      });

      if (updatedRestaurant) {
        message.success("Email updated successfully!");
        setModalVisible(false);
        setIsEmailVerificationVisible(false);
      } else {
        message.error("Failed to update email. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred while updating the email.");
    }
  };

  const handleSendCode = async () => {
    if (!newEmail) {
      message.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const dto: RequestVerificationDto = { email: newEmail };
      await emailVerificationService.requestVerificationCode(dto);
      message.success("Verification email sent. Please check your inbox.");
      setIsEmailVerificationVisible(true);
    } catch (error) {
      message.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!newEmail) {
      message.error("Please enter a valid email address.");
      return;
    }

    try {
      await emailVerificationService.resendVerificationCode({ email: newEmail });
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
          email: newEmail,
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
        Change Email
      </Button>
      <Modal
        title="Change Email"
        open={isModalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        bodyStyle={{ padding: "2rem" }}
      >
        <Form layout="vertical">
          <Form.Item label="New Email">
            <Input
              type="email"
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSendCode}
            disabled={!newEmail}
            loading={loading}
          >
            Verify and Change Email
          </Button>
        </Form>
      </Modal>
      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setIsEmailVerificationVisible(false)}
          onSend={handleVerificationSuccess}
          onResend={handleResend}
          onCheck={handleCheckCode}
          title="Verify Your Email"
          description="Enter the verification code sent to your new email address to confirm the change."
        />
      )}
    </>
  );
};

export default ChangeEmail;
