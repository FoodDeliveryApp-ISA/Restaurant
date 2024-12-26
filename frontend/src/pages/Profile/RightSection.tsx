import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button } from "antd";
import AuthService from "../../services/restaurant.service";
import ToastNotification from "../../components/ToastNotification";

interface Restaurant {
  restaurantName: string;
  restaurantEmail: string;
  restaurantPassword: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  enabled: boolean;
  accessToken?: string;
  id?: string; // Add id property to restaurant type
}

interface RightSectionProps {
  restaurant: Restaurant | null;
}

const RightSection: React.FC<RightSectionProps> = ({ restaurant }) => {
  const [form] = Form.useForm();
  const [restaurantId, setRestaurantId] = useState<string | null>(null); // State to store restaurant ID

  // Set form fields when the restaurant object is available
  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    console.log(storedRestaurantId)
    if (restaurant) {
      setRestaurantId("352"); // Set the restaurant ID if available
      form.setFieldsValue({
        restaurantName: restaurant.restaurantName,
        restaurantEmail: restaurant.restaurantEmail,
        restaurantPassword: restaurant.restaurantPassword,
        restaurantAddress: restaurant.restaurantAddress,
        restaurantPhone: restaurant.restaurantPhone,
        restaurantCity: restaurant.restaurantCity,
        restaurantLocation: restaurant.restaurantLocation,
      });
    }
  }, [restaurant, form]);

  const onFinish = async (values: any) => {
    console.log("Submitted values:", values);

    if (restaurantId) { // Check if restaurantId is available
      try {
        const updatedRestaurant = await AuthService.updateRestaurant(
          restaurantId, // Pass the restaurantId here
          values
        );
        console.log("data ")
        
        // Success notification
        ToastNotification.success({
          message: "Restaurant updated successfully!",
          description: `The restaurant "${updatedRestaurant.restaurantName}" has been updated.`,
        });
        
        console.log("Restaurant updated successfully:", updatedRestaurant);
        
        // Optionally, you can redirect or update UI based on success
        // Example: redirect to the restaurant profile page
        // history.push(`/restaurant/${restaurantId}`);

      } catch (error) {
        console.error("Error updating restaurant:", error);

        // Error notification
        ToastNotification.error({
          message: "Error updating restaurant",
          description: error?.response?.data?.message || "An unexpected error occurred. Please try again.",
        });
      }
    } else {
      console.error("Restaurant ID is missing.");

      // Error notification for missing restaurantId
      ToastNotification.error({
        message: "Restaurant ID is missing",
        description: "Please make sure that the restaurant ID is correctly provided.",
      });
    }
};


  return (
    <Card style={{ padding: "20px" }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          restaurantName: restaurant?.restaurantName || "",
          restaurantEmail: restaurant?.restaurantEmail || "",
          restaurantPassword: restaurant?.restaurantPassword || "",
          restaurantAddress: restaurant?.restaurantAddress || "",
          restaurantPhone: restaurant?.restaurantPhone || "",
          restaurantCity: restaurant?.restaurantCity || "",
          restaurantLocation: restaurant?.restaurantLocation || "",
        }}
      >
        <Form.Item
          name="restaurantName"
          label="Restaurant Name"
          rules={[{ required: true, message: "Please enter the restaurant name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantEmail"
          label="Email"
          rules={[
            { required: true, message: "Please enter the email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantPassword"
          label="Password"
          rules={[{ required: true, message: "Please enter the password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="restaurantAddress"
          label="Address"
          rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantPhone"
          label="Phone"
          rules={[{ required: true, message: "Please enter the phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="restaurantCity"
          label="City"
          rules={[{ required: true, message: "Please enter the city" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="restaurantLocation" label="Location">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RightSection;
