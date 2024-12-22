import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import authService from "../../services/auth.service"; // Import the AuthService

const RestaurantRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: {
    restaurantName: string;
    restaurantEmail: string;
    restaurantPassword: string;
    restaurantAddress: string;
    restaurantPhone: string;
    restaurantCity: string;
    restaurantLocation: string;
    enabled: boolean;
  }) => {
    console.log("Register Values: ", values);

    // Create the object to send to the backend
    const dataToSend = {
      restaurantName: values.restaurantName,
      restaurantEmail: values.restaurantEmail,
      restaurantPassword: values.restaurantPassword,
      restaurantAddress: values.restaurantAddress,
      restaurantPhone: values.restaurantPhone,
      restaurantCity: values.restaurantCity,
      restaurantLocation: values.restaurantLocation,
      enabled: true, // Explicitly set "enabled" to true
    };

    console.log(
      "Data to send to backend:",
      JSON.stringify(dataToSend, null, 2)
    ); // Print out the JSON object

    setLoading(true);

    try {
      // Use authService to register the restaurant
      const response = await authService.register(dataToSend);

      if (response) {
        message.success("Registration successful! Welcome.");
      } else {
        message.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during registration: ", error);
      message.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <Form
        name="restaurant-register"
        layout="vertical"
        onFinish={handleRegister}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <Form.Item
          label="Restaurant Name"
          name="restaurantName"
          rules={[
            { required: true, message: "Please enter the restaurant name!" },
          ]}
        >
          <Input
            prefix={<HomeOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter restaurant name"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="restaurantEmail"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="restaurantPassword"
          rules={[
            { required: true, message: "Please enter your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="restaurantAddress"
          rules={[{ required: true, message: "Please enter the address!" }]}
        >
          <Input
            prefix={
              <EnvironmentOutlined style={{ color: "rgba(0,0,0,0.25)" }} />
            }
            placeholder="Enter restaurant address"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="restaurantPhone"
          rules={[
            { required: true, message: "Please enter your phone number!" },
            {
              pattern: /^\+?\d{10,15}$/,
              message: "Please enter a valid phone number!",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your phone number"
          />
        </Form.Item>

        <Form.Item
          label="City"
          name="restaurantCity"
          rules={[{ required: true, message: "Please enter the city!" }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          label="Location (Latitude, Longitude)"
          name="restaurantLocation"
          rules={[{ required: true, message: "Please enter the location!" }]}
        >
          <Input placeholder="Enter location, e.g., 37.774929° N, 122.419418° W" />
        </Form.Item>

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
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantRegister;
