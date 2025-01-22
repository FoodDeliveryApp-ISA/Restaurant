import React, { useState } from "react";
import { Form, Button, Steps, message } from "antd";
import { useNavigate } from "react-router-dom";
import steps from "./steps"; // Import the steps array
import EmailVerificationPopup from "../../components/EmailVerificationPopup";
import authService from "../../services/auth.service";
import emailVerificationService from "../../services/emailVerification.service";
import { RequestVerificationDto, VerifyEmailDto } from "../../services/dto/emailVerification.dto";

const { Step } = Steps;

const RestaurantRegister: React.FC = () => {
  const [form] = Form.useForm(); // Use Ant Design's form instance
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] = useState(false);
  const navigate = useNavigate();

  const handleVerificationSuccess = async () => {
    try {
      const response = await authService.register(formData);
      message.success("Registration successful!");
      navigate("/profile");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const dto: RequestVerificationDto = { email: formData.restaurantEmail };
      await emailVerificationService.resendVerificationCode(dto);
      message.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      message.error("Failed to resend the verification email.");
    }
  };

  const handleCheckCode = async (): Promise<boolean> => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const verificationCode = Array.from(inputs)
      .map((input) => (input as HTMLInputElement).value)
      .join("")
      .slice(-6);

    try {
      const dto: VerifyEmailDto = { email: formData.restaurantEmail, verificationCode };
      await emailVerificationService.verifyUser(dto);
      await handleVerificationSuccess();
      return true;
    } catch (error) {
      message.error("Invalid or expired verification code.");
      return false;
    }
  };

  const handleFinish = async (values: any) => {
    console.log("Register function triggered");
    const finalData = { ...formData, ...values, enabled: true };
    console.log("Final form data:", finalData);
    setFormData(finalData);
    setLoading(true);

    try {
      const dto: RequestVerificationDto = { email: finalData.restaurantEmail };
      await emailVerificationService.requestVerificationCode(dto);
      message.success("Verification email sent. Please check your inbox.");
      setIsEmailVerificationVisible(true);
    } catch (error) {
      message.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishFailed = (errorInfo: any) => {
    console.error("Validation Failed:", errorInfo);
    message.error("Please correct the errors in the form.");
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields(); // Validate current step fields
      console.log("Step Data:", values);
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  const currentSteps = steps(form, setFormData);

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <Steps current={currentStep}>
        {currentSteps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <Form
        form={form}
        name="restaurant-register"
        layout="vertical"
        onFinish={currentStep === currentSteps.length - 1 ? handleFinish : handleNext}
        onFinishFailed={handleFinishFailed}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        {currentSteps[currentStep].content}
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
              }}
            >
              {currentStep === currentSteps.length - 1 ? "Register" : "Next"}
            </Button>
          </div>
        </Form.Item>
      </Form>

      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setIsEmailVerificationVisible(false)}
          onResend={handleResend}
          onSend={handleVerificationSuccess}
          onCheck={handleCheckCode}
          title="Verify Your Email"
          description="Please enter the verification code to continue."
          successMessage="Thank you for verifying your email!"
          timerDuration={60}
        />
      )}
    </div>
  );
};

export default RestaurantRegister;
