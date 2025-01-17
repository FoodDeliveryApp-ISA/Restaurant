// components/ChangeEmail.tsx

import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import EmailVerificationPopup from "../../../components/EmailVerificationPopup"; // Update path as necessary
import emailVerificationService from "../../../services/emailVerification.service"; // Update path as necessary
import restaurantService from "../../../services/restaurant.service"; // Import the service to update the restaurant

interface ChangeEmailProps {
    onEmailChange: (newLocation: string) => void;
    userEmail: string; // Pass the user's email as a prop for verification
  }
const ChangeEmail: React.FC =<ChangeEmailProps> = ({
    onEmailChange,
    userEmail,
  }) =>  {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEmailVerificationVisible, setEmailVerificationVisible] =
    useState(false);

  const handleSave = async () => {
    const values = await form.validateFields();
    console.log("Email Change Data:", values);
    setModalVisible(false);
    setEmailVerificationVisible(true); // Show verification popup after submission
    return values;
  };

  const handleVerificationSuccess = async () => {
    const values = await handleSave();
    if (values) {
      try {
        const updatedRestaurant = await restaurantService.updateRestaurantEmail(
          values.email
        );
        if (updatedRestaurant) {
          message.success("Email updated successfully!");
        } else {
          message.error("Failed to update email.");
        }
      } catch (error) {
        message.error("Error during email update.");
      }
    }
  };

  const handleResend = async () => {
    try {
      const dto = { email: form.getFieldValue("email") };
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
      const dto = { email: form.getFieldValue("email"), verificationCode };
      await emailVerificationService.verifyUser(dto);
      await handleVerificationSuccess();
      return true;
    } catch (error) {
      message.error("Invalid or expired verification code.");
      return false;
    }
  };

  const [form] = Form.useForm();

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Change Email
      </Button>
      <Modal
        title="Change Email"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleSave}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Form.Item
            label="New Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter a valid email address!",
              },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter new email" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "1rem" }}
          >
            Save Email
          </Button>
        </Form>
      </Modal>

      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setEmailVerificationVisible(false)}
          onResend={handleResend}
          onSend={handleVerificationSuccess}
          onCheck={handleCheckCode}
          title="Verify Your Updates!"
          description="Please enter the verification code to continue."
          successMessage="Thank you for verifying your email!"
          timerDuration={60}
        />
      )}
    </>
  );
};

export default ChangeEmail;
