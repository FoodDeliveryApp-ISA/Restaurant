import React from "react";
import { Form, Input } from "antd";
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";

const Step2: React.FC = () => {
  return (
    <>
      <Form.Item
        label="Address"
        name="restaurantAddress"
        rules={[{ required: true, message: "Please enter the address!" }]}
      >
        <Input
          prefix={<EnvironmentOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
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
    </>
  );
};

export default Step2;
