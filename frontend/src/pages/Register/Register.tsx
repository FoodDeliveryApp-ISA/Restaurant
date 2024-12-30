import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Steps } from "antd";
import { MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { ValidationService } from "../../services/validation.service"; // Assuming this is imported correctly

const { Step } = Steps;

const RestaurantRegister: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [restaurantNameError, setRestaurantNameError] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantEmail, setRestaurantEmail] = useState<string>("");
  const navigate = useNavigate();

  const steps = [
    {
      title: "Basic Details",
      content: (
        <>
          <Form.Item
            label="Restaurant Name"
            name="restaurantName"
            rules={[
              { required: true, message: "Please enter the restaurant name!" },
              {
                validator: async (_, value) => {
                  if (value) {
                    const isUnique = await ValidationService.validateRestaurant(value);
                    if (!isUnique) {
                      return Promise.reject(new Error("Restaurant name is already taken"));
                    }
                  }
                },
              },
            ]}
          >
            <Input
              prefix={<HomeOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Enter restaurant name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="restaurantEmail"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
              {
                validator: async (_, value) => {
                  if (value) {
                    const isUnique = await ValidationService.validateEmail(value);
                    if (!isUnique) {
                      return Promise.reject(new Error("Email is already taken"));
                    }
                  }
                },
              },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Enter your email"
              value={restaurantEmail}
              onChange={(e) => setRestaurantEmail(e.target.value)}
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
      ),
    },
    {
      title: "Additional Details",
      content: (
        <>
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
        </>
      ),
    },
  ];

  const handleNext = (values: any) => {
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
  };

  const handleFinish = async (values: any) => {
    const finalData = { ...formData, ...values, enabled: true };
    setLoading(true);

    try {
      const response = await authService.register(finalData);
      navigate("/profile");
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
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <Form
        name="restaurant-register"
        layout="vertical"
        onFinish={currentStep === steps.length - 1 ? handleFinish : handleNext}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        {steps[currentStep].content}
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                backgroundColor: "#FF5733",
                borderColor: "#FF5733",
                height: "40px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {currentStep === steps.length - 1 ? "Register" : "Next"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantRegister;
