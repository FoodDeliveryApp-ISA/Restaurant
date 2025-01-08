import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  Space,
  Typography,
  Tooltip,
  Divider,
  message,
} from "antd";
import { SaveOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import RestaurantService from "../../services/restaurant.service";
import ToastNotification from "../../components/ToastNotification";
import emailVerificationService from "../../services/emailVerification.service";
import {
  RequestVerificationDto,
  VerifyEmailDto,
} from "../../services/dto/emailVerification.dto";
import EmailVerificationPopup from "../../components/EmailVerificationPopup";

const { Title } = Typography;

interface RestaurantResponseDto {
  restaurantId: number;
  restaurantName: string;
  restaurantEmail: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  active: boolean;
  coverImageUrl: string;
}

interface RightSectionProps {
  restaurant: RestaurantResponseDto | null; // Ensure this is the correct type
}

const RightSection: React.FC<RightSectionProps> = ({ restaurant }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] =
    useState(false);

  const handleVerificationSuccess = async () => {
    const values = await handleSave();
    if (values) {
      console.log("Values saved:", values);
    }
  };

  // Handles resending the verification code
  const handleResend = async () => {
    try {
      const dto: RequestVerificationDto = { email: restaurant.restaurantEmail };
      await emailVerificationService.resendVerificationCode(dto);
      message.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      message.error("Failed to resend the verification email.");
    }
  };

  // Handles checking the verification code
  const handleCheckCode = async (): Promise<boolean> => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const verificationCode = Array.from(inputs)
      .map((input) => (input as HTMLInputElement).value)
      .join("")
      .slice(-6); // Ensure only the last 6 characters are used

    try {
      const dto: VerifyEmailDto = {
        email: restaurant.restaurantEmail,
        verificationCode,
      };
      console.log(restaurant);
      console.log(dto);
      await emailVerificationService.verifyUser(dto);
      console.log(dto);
      await handleVerificationSuccess();
      return true;
    } catch (error) {
      message.error("Invalid or expired verification code.");
      return false;
    }
  };

  // Set form fields when the restaurant object is available
  useEffect(() => {
    if (restaurant) {
      form.setFieldsValue({
        restaurantName: restaurant.restaurantName,
        restaurantEmail: restaurant.restaurantEmail,
        restaurantAddress: restaurant.restaurantAddress,
        restaurantPhone: restaurant.restaurantPhone,
        restaurantCity: restaurant.restaurantCity,
        restaurantLocation: restaurant.restaurantLocation,
      });
    }
  }, [restaurant, form]);

  // Function to handle save button click
  const handleSave = async () => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "Confirm Save",
        content: "Are you sure you want to save the changes?",
        okText: "Yes",
        cancelText: "No",
        onOk: async () => {
          setLoading(true);
          const values = form.getFieldsValue();
          console.log("Values ", values);
          try {
            const updatedRestaurant =
              await RestaurantService.updateAuthenticatedRestaurant(values);

            ToastNotification.success({
              message: "Restaurant updated successfully!",
              description: `The restaurant "${updatedRestaurant?.restaurantName}" has been updated.`,
            });

            setIsEditing(false); // Disable editing after saving
            resolve(values); // Resolve the promise with saved values
          } catch (error) {
            ToastNotification.error({
              message: "Error updating restaurant",
              description:
                error?.response?.data?.message ||
                "An unexpected error occurred. Please try again.",
            });
            reject(error); // Reject the promise with the error
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          resolve(null); // Resolve with `null` if canceled
        },
      });
    });
  };
  const handleSendCode = async () => {
    try {
      setLoading(true);

      // Get the form values and filter changed fields
      const values = form.getFieldsValue();
      const changedValues = Object.keys(values).reduce((acc, key) => {
        if (values[key] !== restaurant?.[key]) {
          acc[key] = values[key];
        }
        return acc;
      }, {});

      // If no changes detected, show a message and return early
      if (Object.keys(changedValues).length === 0) {
        message.info("No changes detected to send.");
        setLoading(false);
        return;
      }

      // Create the request DTO using only changed values
      const dto: RequestVerificationDto = {
        email: changedValues.restaurantEmail,
      };

      // Send verification code
      await emailVerificationService.requestVerificationCode(dto);
      message.success("Verification email sent. Please check your inbox.");

      // Update visibility state
      setIsEmailVerificationVisible(true);
    } catch (error) {
      message.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle editing state
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Card
        style={{
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Restaurant Details
      </Title>
      <Divider /> */}
        <Form layout="vertical" form={form}>
          <Form.Item
            name="restaurantName"
            label="Restaurant Name"
            rules={[
              { required: true, message: "Please enter the restaurant name" },
            ]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="restaurantEmail"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="restaurantAddress"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="restaurantPhone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="restaurantCity"
            label="City"
            rules={[{ required: true, message: "Please enter the city" }]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Divider />

          <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
            {isEditing ? (
              <Space size="large">
                <Button
                  type="primary"
                  onClick={() => handleSendCode()}
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Save Changes
                </Button>
                <Button onClick={toggleEdit} icon={<CloseOutlined />} danger>
                  Cancel
                </Button>
              </Space>
            ) : (
              <Tooltip title="Edit restaurant details">
                <Button
                  onClick={toggleEdit}
                  icon={<EditOutlined />}
                  type="default"
                  style={{ width: "100%" }}
                >
                  Edit
                </Button>
              </Tooltip>
            )}
          </Form.Item>
        </Form>
      </Card>
      {isEmailVerificationVisible && (
        <EmailVerificationPopup
          visible={isEmailVerificationVisible}
          onClose={() => setIsEmailVerificationVisible(false)}
          onResend={handleResend}
          onSend={handleVerificationSuccess}
          onCheck={handleCheckCode} // Pass the onCheck function
          title="Custom Email Verification"
          description="Please enter the verification code to continue."
          successMessage="Thank you for verifying your email!"
          timerDuration={60}
        />
      )}
    </>
  );
};

export default RightSection;
