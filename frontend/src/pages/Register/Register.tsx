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

    // Simulate registration API call
    setTimeout(() => {
      setLoading(false);
      message.success("Registration successful!");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <Form
        name="register"
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

        {/* Username Field */}
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Enter your username"
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

        {/* Confirm Password Field */}
        <Form.Item
          label="Confirm Password"
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
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Confirm your password"
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
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
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

export default Register;

