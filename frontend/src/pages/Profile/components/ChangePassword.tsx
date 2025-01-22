import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import EmailVerificationPopup from "../../../components/EmailVerificationPopup";
import passwordService from "../../../services/password.service";
import emailVerificationService from "../../../services/emailVerification.service";
import TokenUtil from "../../../utils/tokenUtil";

const ChangePassword: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEmailVerificationVisible, setEmailVerificationVisible] =
    useState(false);
  const userEmail = TokenUtil.getEmail() || "Your email";

  interface VerifyEmailDto {
    email: string;
    verificationCode: string;
  }

  const handlePasswordChange = async (values: any) => {
    try {
      await passwordService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully!");
      setModalVisible(false);
      setEmailVerificationVisible(true);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Password change failed.");
    }
  };

  const handleResend = async () => {
    try {
      if (!userEmail) {
        throw new Error("Email is unavailable.");
      }
      await emailVerificationService.resendVerificationCode(userEmail);
      message.success(`Verification email resent to ${userEmail}.`);
    } catch (error: any) {
      message.error(
        error.message || "Failed to resend the verification email."
      );
    }
  };

  const handleCheckCode = async (): Promise<boolean> => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const verificationCode = Array.from(inputs)
      .map((input) => (input as HTMLInputElement).value)
      .join("")
      .slice(-6);

    try {
      if (!userEmail) {
        throw new Error("Email is unavailable.");
      }
      const dto: VerifyEmailDto = {
        email: userEmail,
        verificationCode,
      };
      await emailVerificationService.verifyUser(dto);
      message.success("Email verified successfully!");
      setEmailVerificationVisible(false);
      return true;
    } catch (error: any) {
      message.error(error.message || "Invalid or expired verification code.");
      return false;
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          className="flex items-center justify-center gap-2"
        >
          <LockOutlined />
          Change Password
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
                <span className="text-blue-600 font-bold flex items-center gap-2">
                  <LockOutlined />
                  Change Password
                </span>
              }
              visible={isModalVisible}
              footer={null}
              onCancel={() => setModalVisible(false)}
              className="rounded-lg"
            >
              <Form
                onFinish={handlePasswordChange}
                layout="vertical"
                className="space-y-4"
              >
                <Form.Item
                  label="Old Password"
                  name="oldPassword"
                  rules={[{ required: true, message: "Please enter your old password!" }]}
                >
                  <Input.Password
                    placeholder="Enter old password"
                    prefix={<LockOutlined />}
                    className="rounded-lg"
                  />
                </Form.Item>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Please enter your new password!" },
                    { min: 6, message: "Password must be at least 6 characters long!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter new password"
                    prefix={<LockOutlined />}
                    className="rounded-lg"
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Please confirm your new password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Passwords do not match!"));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm new password"
                    prefix={<LockOutlined />}
                    className="rounded-lg"
                  />
                </Form.Item>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="hover:scale-105 transform transition duration-300 rounded-full h-12 font-bold"
                  >
                    Save Password
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
          onClose={() => setEmailVerificationVisible(false)}
          onResend={handleResend}
          onCheck={handleCheckCode}
          title={
            <span className="flex items-center gap-2">
              <MailOutlined />
              Verify Your Password Change
            </span>
          }
          description={`Please enter the verification code sent to ${userEmail} to confirm the password change.`}
          successMessage="Your password has been successfully updated!"
          timerDuration={60}
        />
      )}
    </>
  );
};

export default ChangePassword;
