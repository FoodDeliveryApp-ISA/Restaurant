import React, { useState } from "react";
import { Form, Button, Steps, message } from "antd";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import Step1 from "./Step1";
import Step2 from "./Step2";

const { Step } = Steps;

const RestaurantRegister: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { title: "Basic Details", content: <Step1 /> },
    { title: "Additional Details", content: <Step2 /> },
  ];

  const handleNext = (values: any) => {
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
  };

  const handleFinish = async (values: any) => {
    const finalData = { ...formData, ...values, active: true };
    setLoading(true);
    try {
      await authService.register(finalData);
      navigate("/profile");
    } catch (error: any) {
      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep} className="mb-6">
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <Form
        layout="vertical"
        onFinish={currentStep === steps.length - 1 ? handleFinish : handleNext}
        className="space-y-4"
      >
        {steps[currentStep].content}
        <Form.Item className="flex justify-between">
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
          <Button type="primary" htmlType="submit" loading={loading}>
            {currentStep === steps.length - 1 ? "Register" : "Next"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantRegister;