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
} from "antd";
import { SaveOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import RestaurantService from "../../services/restaurant.service";
import ToastNotification from "../../components/ToastNotification";

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
  const handleSave = () => {
    Modal.confirm({
      title: "Confirm Save",
      content: "Are you sure you want to save the changes?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        const values = form.getFieldsValue();
        try {
          const updatedRestaurant =
            await RestaurantService.updateAuthenticatedRestaurant(
              restaurant?.restaurantId || 0,
              values
            );

          ToastNotification.success({
            message: "Restaurant updated successfully!",
            description: `The restaurant "${updatedRestaurant?.restaurantName}" has been updated.`,
          });

          setIsEditing(false); // Disable editing after saving
        } catch (error) {
          ToastNotification.error({
            message: "Error updating restaurant",
            description:
              error?.response?.data?.message ||
              "An unexpected error occurred. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Function to toggle editing state
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
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
          rules={[{ required: true, message: "Please enter the phone number" }]}
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
        {/* <Form.Item name="restaurantLocation" label="Location">
          <Input disabled={!isEditing} />
        </Form.Item> */}
        {/* <Divider /> */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          {isEditing ? (
            <Space size="large">
              <Button
                type="primary"
                onClick={handleSave}
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
  );
};

export default RightSection;
