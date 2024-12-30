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
      message.success("Registration successful!");
      navigate("/profile");
    } catch (error: any) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-md rounded-lg dark:bg-gray-800 dark:shadow-gray-700">
      <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
        Restaurant Registration
      </h2>
      <Steps
        current={currentStep}
        size="small"
        className="mb-6"
        direction="horizontal"
      >
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <Form
        layout="vertical"
        onFinish={currentStep === steps.length - 1 ? handleFinish : handleNext}
        className="space-y-4"
      >
        <div className="rounded-md p-4 shadow-sm bg-gray-50 dark:bg-gray-700">
          {steps[currentStep].content}
        </div>
        <Form.Item className="flex justify-between">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mr-4"
            >
              Previous
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {currentStep === steps.length - 1 ? "Register" : "Next"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantRegister;
