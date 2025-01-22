import React from "react";
import { Card, Typography, Divider } from "antd";
import { Order } from "./order.type";

const { Title, Text } = Typography;

interface OrderDetailsProps {
  order: Order | null; // Accepts order or null
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  if (!order) {
    return (
      <Card
        bordered={false}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "20px",
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        <Text type="secondary">No order selected.</Text>
      </Card>
    );
  }

  return (
    <Card
      bordered={false}
      // style={{
      //   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      //   borderRadius: "8px",
      //   padding: "16px",
      //   width: "100%",
      //   maxWidth: 400,
      //   margin: "0 auto",
      // }}
    >
      {/* <div
        style={{
          backgroundColor: "#1890ff", // Blue background for title
          borderRadius: "8px", // Rounded corners
          padding: "10px",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        <Title
          level={5}
          style={{
            color: "#fff", // White text for contrast
            margin: 0,
          }}
        >
          Order Details
        </Title>
      </div> */}
      <div style={{ marginBottom: 8 }}>
        <Text strong>Order ID:</Text>
        <Text style={{ marginLeft: 8 }}>{order.orderId}</Text>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <div style={{ marginBottom: 8 }}>
        <Text strong>Customer Name:</Text>
        <Text style={{ marginLeft: 8 }}>{order.customerName}</Text>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <div style={{ marginBottom: 8 }}>
        <Text strong>Address:</Text>
        <Text style={{ marginLeft: 8 }}>{order.customerAddress}</Text>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <div>
        <Text strong>Phone:</Text>
        <Text style={{ marginLeft: 8 }}>{order.customerPhone}</Text>
      </div>
    </Card>
  );
};

export default OrderDetails;

