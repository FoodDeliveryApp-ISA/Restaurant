import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = (values: {
    email: string;
    username: string;
    password: string;
  }) => {
    console.log("Register Values: ", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Registration successful!");
    }, 1000);
  };

  return (
    <Form name="register" onFinish={handleRegister}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please enter your username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Please enter your password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="confirm"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
