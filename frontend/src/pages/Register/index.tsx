import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Steps, Button, Input, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  RestaurantRegistrationSchema,
  RestaurantRegistrationDTO,
} from "../../schemas/RestaurantRegistrationSchema";
import authService from "../../services/auth.service";

const { Step } = Steps;

const RestaurantRegister: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantRegistrationDTO>({
    resolver: zodResolver(RestaurantRegistrationSchema),
    mode: "onChange",
  });

  const steps = [
    {
      title: "Basic Details",
      content: (
        <>
          <div style={{ marginBottom: 16 }}>
            <label>Restaurant Name</label>
            <Input
              {...register("restaurantName")}
              prefix={<HomeOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Enter restaurant name"
            />
            {errors.restaurantName && (
              <p style={{ color: "red" }}>{errors.restaurantName.message}</p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Email</label>
            <Input
              {...register("restaurantEmail")}
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Enter your email"
            />
            {errors.restaurantEmail && (
              <p style={{ color: "red" }}>{errors.restaurantEmail.message}</p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Password</label>
            <Input.Password
              {...register("restaurantPassword")}
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Enter your password"
            />
            {errors.restaurantPassword && (
              <p style={{ color: "red" }}>
                {errors.restaurantPassword.message}
              </p>
            )}
          </div>
        </>
      ),
    },
    {
      title: "Additional Details",
      content: (
        <>
          <div style={{ marginBottom: 16 }}>
            <label>Address</label>
            <Input
              {...register("restaurantAddress")}
              prefix={
                <EnvironmentOutlined style={{ color: "rgba(0,0,0,0.25)" }} />
              }
              placeholder="Enter restaurant address"
            />
            {errors.restaurantAddress && (
              <p style={{ color: "red" }}>{errors.restaurantAddress.message}</p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Phone Number</label>
            <Input
              {...register("restaurantPhone")}
              prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Enter your phone number"
            />
            {errors.restaurantPhone && (
              <p style={{ color: "red" }}>{errors.restaurantPhone.message}</p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>City</label>
            <Input {...register("restaurantCity")} placeholder="Enter city" />
            {errors.restaurantCity && (
              <p style={{ color: "red" }}>{errors.restaurantCity.message}</p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Location (Latitude, Longitude)</label>
            <Input
              {...register("restaurantLocation")}
              placeholder="Enter location, e.g., 37.774929° N, 122.419418° W"
            />
            {errors.restaurantLocation && (
              <p style={{ color: "red" }}>
                {errors.restaurantLocation.message}
              </p>
            )}
          </div>
        </>
      ),
    },
  ];

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handleFinish = async (data: any) => {
    const finalData = { ...formData, ...data, enabled: true };
    setLoading(true);

    try {
      const response = await authService.register(finalData);
      message.success("Restaurant registered successfully!");
    } catch (error: any) {
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
      <form
        onSubmit={handleSubmit(
          currentStep === steps.length - 1 ? handleFinish : handleNext
        )}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        {steps[currentStep].content}
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
      </form>
    </div>
  );
};

export default RestaurantRegister;
