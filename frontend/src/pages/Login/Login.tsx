import React, { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import passwordService from "../../services/password.service";
import ToastNotification from "../../components/ToastNotification";
import { z } from "zod";
import { RestaurantLoginSchema, RestaurantLoginDTO } from "../../schemas/RestaurantLoginSchema";

const RestaurantLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Handle login submission
  const handleLogin = async (values: RestaurantLoginDTO) => {
    setLoading(true);

    try {
      // Validate with zod schema
      RestaurantLoginSchema.parse(values);

      const response = await authService.login(values);
      console.log(response);
      if (response) {
        ToastNotification.success({
          message: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/profile");
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle zod validation errors
        message.error(error.errors[0]?.message || "Validation error.");
      } else {
        console.error("Error during login:", error);
        message.error(
          error?.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle "Forgot Password" click
  const showForgotPasswordModal = () => {
    setIsModalVisible(true);
  };

  // Handle password reset request
  const handleForgotPassword = async () => {
    setResetLoading(true);
    try {
      await passwordService.requestPasswordReset({ email });
      ToastNotification.success({
        message: "Password Reset Email Sent",
        description: "Please check your email for reset instructions.",
      });
      setIsModalVisible(false);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <Form
        name="restaurant-login"
        layout="vertical"
        onFinish={handleLogin}
        initialValues={{ remember: true }}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: 20,
          borderRadius: 8,
        }}
      >
        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your email"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your password"
          />
        </Form.Item>

        {/* Forgot Password Link */}
        <Form.Item>
          <Button
            type="link"
            onClick={showForgotPasswordModal}
            style={{ padding: 0 }}
          >
            Forgot Password?
          </Button>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              backgroundColor: "#FF5733",
              borderColor: "#FF5733",
              height: "40px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      {/* Forgot Password Modal */}
      <Modal
        title="Reset Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={resetLoading}
            onClick={handleForgotPassword}
          >
            Submit
          </Button>,
        ]}
      >
        <p>Please enter your email address to reset your password.</p>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default RestaurantLogin;
