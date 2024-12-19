import React, { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

const RestaurantRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = (values: {
    email: string;
    name: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    console.log("Register Values: ", values);
    setLoading(true);

    // Simulate registration API call
    setTimeout(() => {
      setLoading(false);
      message.success("Registration successful! Welcome to the restaurant team.");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h2 className="text-center mb-4" style={{ fontWeight: "bold", fontSize: 24 }}>
        Restaurant Staff Registration
      </h2>
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
        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
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

        {/* Name Field */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your full name"
          />
        </Form.Item>

        {/* Phone Field */}
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number!" },
            { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit phone number!" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your phone number"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
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

        {/* Role Field */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select your role!" }]}
        >
          <Select placeholder="Select your role">
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="manager">Manager</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
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
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantRegister;
