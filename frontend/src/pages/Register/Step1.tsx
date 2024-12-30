import React, { useState } from "react";
import { Form, Input, Progress, Collapse, Tooltip, Button } from "antd";
import { MailOutlined, HomeOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

// Password strength function
const passwordStrength = (password: string) => {
  const lengthScore = password.length >= 6 ? 1 : 0;
  const uppercaseScore = /[A-Z]/.test(password) ? 1 : 0;
  const numberScore = /[0-9]/.test(password) ? 1 : 0;
  const specialCharScore = /[^A-Za-z0-9]/.test(password) ? 1 : 0;
  const extraLengthScore = password.length >= 12 ? 1 : 0; // Reward longer passwords.

  const totalScore = lengthScore + uppercaseScore + numberScore + specialCharScore + extraLengthScore;

  switch (totalScore) {
    case 0:
    case 1:
      return { score: 25, label: "Too Short", color: "red" };
    case 2:
      return { score: 50, label: "Weak", color: "orange" };
    case 3:
      return { score: 75, label: "Fair", color: "yellow" };
    case 4:
    case 5:
      return { score: 100, label: "Strong", color: "green" };
    default:
      return { score: 0, label: "Too Short", color: "red" };
  }
};

const Step1: React.FC = () => {
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true); // To track password validation status
  const [showStrength, setShowStrength] = useState(false);
  const [form] = Form.useForm(); // To trigger form validation

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setShowStrength(!!newPassword);
    const strength = passwordStrength(newPassword);
    // Check if the password meets the minimum criteria (e.g., length)
    setPasswordValid(strength.score >= 50);
  };

  const strength = passwordStrength(password);

  return (
    <div className="space-y-4">
      <Form.Item
        label="Restaurant Name"
        name="restaurantName"
        rules={[{ required: true, message: "Please enter the restaurant name!" }]}
      >
        <Input
          prefix={<HomeOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          placeholder="Enter restaurant name"
          className="rounded-md shadow-sm"
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
          prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          placeholder="Enter your email"
          className="rounded-md shadow-sm"
        />
      </Form.Item>
      <Form.Item
        label={
          <div className="flex items-center space-x-2">
            <span>Password</span>
            <Tooltip title="Your password must meet specific requirements.">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
            </Tooltip>
          </div>
        }
        name="restaurantPassword"
        validateStatus={passwordValid ? "success" : "error"} // Show validation status
        help={passwordValid ? "" : "Password must meet the minimum requirements."} // Show error message
        rules={[
          {
            validator: (_, value) => {
              if (!value) {
                return Promise.reject("Please enter your password!");
              }
              if (!passwordValid) {
                return Promise.reject("Your password is too weak!");
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          placeholder="Enter your password"
          className="rounded-md shadow-sm"
          onChange={handlePasswordChange}
        />
        {showStrength && (
          <div className="mt-2">
            <Progress
              percent={strength.score}
              showInfo={false}
              strokeColor={strength.color}
              className="rounded-md"
            />
            <p
              className={`text-sm mt-1 ${
                strength.color === "red"
                  ? "text-red-500"
                  : strength.color === "orange"
                  ? "text-orange-500"
                  : strength.color === "yellow"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {strength.label}
            </p>
          </div>
        )}
      </Form.Item>
      {showStrength && (
        <Collapse className="bg-gray-100 p-2 rounded-md">
          <Panel header="Password Rules" key="1">
            <ul className="list-disc pl-6 text-gray-600">
              <li>Password must be at least 6 characters long.</li>
              <li>Include at least one uppercase letter (A-Z).</li>
              <li>Include at least one number (0-9).</li>
              <li>Include at least one special character (e.g., @, #, $).</li>
            </ul>
          </Panel>
        </Collapse>
      )}
    </div>
  );
};

export default Step1;
