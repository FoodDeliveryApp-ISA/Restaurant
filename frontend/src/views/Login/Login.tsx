import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (values: { username: string; password: string }) => {
    console.log("Login Values: ", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Login successful!");
    }, 1000);
  };

  return (
    <Form
      name="login"
      onFinish={handleLogin}
      initialValues={{ remember: true }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please enter your username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          color="default"
          htmlType="submit"
          block
          loading={loading}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
