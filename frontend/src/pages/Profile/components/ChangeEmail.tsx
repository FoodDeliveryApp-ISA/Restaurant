import React, { useState } from "react";
import { Modal, Form, Button, Input, message } from "antd";
import { MailOutlined, EditOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import EmailVerificationPopup from "../../../components/EmailVerificationPopup";
import restaurantService from "../../../services/restaurant.service";
import emailVerificationService from "../../../services/emailVerification.service";
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
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] =
    useState(false);
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
      .slice(-6);

    try {
      const dto: VerifyEmailDto = {
        email: newEmail || "",
        verificationCode,
      };
      await emailVerificationService.verifyUser(dto);
      await handleVerificationSuccess();
      return true;
    } catch (error) {
      message.error("Invalid or expired verification code.");
      return false;
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          className="mb-4 flex items-center gap-2"
        >
          <EditOutlined />
          Change Email
        </Button>
      </motion.div>

      <AnimatePresence>
        {isModalVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              title={
                <span className="flex items-center gap-2">
                  <MailOutlined />
                  Change Email
                </span>
              }
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
                    prefix={<MailOutlined />}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </Form.Item>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    type="primary"
                    onClick={handleSendCode}
                    disabled={!newEmail}
                    loading={loading}
                    className="w-full"
                  >
                    Verify and Change Email
                  </Button>
                </motion.div>
              </Form>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setIsEmailVerificationVisible(false)}
          onSend={handleSendCode}
          onResend={handleResend}
          onCheck={handleCheckCode}
          title={
            <span className="flex items-center gap-2">
              <MailOutlined />
              Verify Your Email
            </span>
          }
          description="Enter the verification code sent to your new email address to confirm the change."
        />
      )}
    </>
  );
};

export default ChangeEmail;
