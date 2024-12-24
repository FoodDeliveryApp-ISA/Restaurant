import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import ToastNotification from "../../components/ToastNotification";
import { z } from "zod";
import { RestaurantLoginSchema, RestaurantLoginDTO } from "../../schemas/RestaurantLoginSchema";

const RestaurantLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    </div>
  );
};

export default RestaurantLogin;
