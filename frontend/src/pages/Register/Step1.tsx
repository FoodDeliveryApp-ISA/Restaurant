import React from "react";
import { Form, Input } from "antd";
import { HomeOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const Step1: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default Step1;
