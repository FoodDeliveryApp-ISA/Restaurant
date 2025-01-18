import React from "react";
import { Form, Input } from "antd";
import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import SelectLocation from "./SelectLocation"; // Adjust path
import { validateRestaurantName, validateEmail, passwordRules , locationRule,cityRule,phoneNumberRule} from "./validations"; // Adjust path

const steps = (form: any, setRestaurantDetails: React.Dispatch<React.SetStateAction<any>>) => [
  {
    title: "Basic Details",
    content: (
      <>
        <Form.Item
          label="Restaurant Name"
          name="restaurantName"
          rules={[{ validator: validateRestaurantName }]}
        >
          <Input
            prefix={<HomeOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter restaurant name"
            onChange={(e) => {
              const value = e.target.value;
              console.log("Updating Restaurant Name:", value);
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantName: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          name="restaurantEmail"
          rules={[{ validator: validateEmail }]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your email"
            onChange={(e) => {
              const value = e.target.value;
              console.log("Updating Email:", value);
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantEmail: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="restaurantPassword"
          rules={passwordRules}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your password"
            onChange={(e) => {
              const value = e.target.value;
              console.log("Updating Password:", value);
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantPassword: value,
              }));
            }}
          />
        </Form.Item>
      </>
    ),
  },
  {
    title: "Additional Details",
    content: (
      <>
        <Form.Item
          label="Address"
          name="restaurantAddress"
          rules={[{ required: true, message: "Address is required." }]}
        >
          <Input
            prefix={<EnvironmentOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter restaurant address"
            onChange={(e) => {
              const value = e.target.value;
              console.log("Updating Address:", value);
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantAddress: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="restaurantPhone"
          rules={phoneNumberRule}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your phone number"
            onChange={(e) => {
              const value = e.target.value;
              console.log("Updating Phone Number:", value);
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantPhone: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="City"
          name="restaurantCity"
          rules={cityRule}
        >
          <Input
            placeholder="Enter city"
            onChange={(e) => {
              const value = e.target.value;
              console.log("Updating City:", value);
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantCity: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="Location"
          name="restaurantLocation"
          rules={locationRule}
        >
          <SelectLocation
            onLocationSelected={(location) => {
              const locationString = `${location.lat}, ${location.lng}`;
              console.log("Selected Location:", locationString, location);

              // Update the form state
              form.setFieldsValue({ restaurantLocation: locationString });

              // Update the custom state
              setRestaurantDetails((prev) => ({
                ...prev,
                restaurantLocation: locationString,
              }));
            }}
          />
        </Form.Item>
      </>
    ),
  },
];

export default steps;
