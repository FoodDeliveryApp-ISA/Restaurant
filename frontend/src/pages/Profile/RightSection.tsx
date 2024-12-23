import React from "react";
import {  Card, Form, Input, Button} from "antd";



const RightSection = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Submitted values:", values);
  };

  return (
    <Card style={{ padding: "20px" }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          restaurantName: "Sample Restaurant",
          restaurantEmail: "email@restaurant.com",
          restaurantPassword: "password123",
          restaurantAddress: "123 Food St.",
          restaurantPhone: "123-456-7890",
          restaurantCity: "Food City",
          restaurantLocation: "Latitude, Longitude",
        }}
      >
        <Form.Item
          name="restaurantName"
          label="Restaurant Name"
          rules={[{ required: true, message: "Please enter the restaurant name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantEmail"
          label="Email"
          rules={[
            { required: true, message: "Please enter the email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantPassword"
          label="Password"
          rules={[{ required: true, message: "Please enter the password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="restaurantAddress"
          label="Address"
          rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantPhone"
          label="Phone"
          rules={[{ required: true, message: "Please enter the phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantCity"
          label="City"
          rules={[{ required: true, message: "Please enter the city" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="restaurantLocation" label="Location">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};



export default RightSection;