import React, { useState, useEffect } from "react";
import { Button } from "antd";
import OrderDetailsPopup from "./components/OrderDetailsPopup";
import OrderTable from "./components/OrderTable";
import MultiStagePopup from "./components/MultiStagePopup";
import orderService from "../../services/order.service";

export interface Order {
    orderId: string;
    restaurantLocation: [number, number];
    customerLocation: [number, number];
    customerName: string;
    customerAddress: string;
    customerPhone: string;
  }

const statusFlow = [
  "Order Created",
  "Cooking",
  "Searching Rider",
  "Out for Delivery",
  "Delivered",
];

const OrderStatusManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isMultiStageModalVisible, setIsMultiStageModalVisible] =
    useState(false);

    const addOrder = async () => {
      const restaurantIds = ["1", "2", "353", "353.452", "607"];
      const randomRestaurantId =
        restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
    
      const newOrder = {
        orderId: `ORD${orders.length + 1}`,
        restaurantId: randomRestaurantId,
        restaurantLocation: [40.7128, -74.0060], // Example location for the restaurant (New York)
        customerLocation: [34.0522, -118.2437], // Example location for the customer (Los Angeles)
        customerName: `Customer ${orders.length + 1}`,
        customerAddress: "123 Main St",
        customerPhone: "0771234567",
      };
    
      // Update the local orders state
      setOrders([...orders, newOrder]);
    
      // Send the new order to the server
      const customerOrderDto = {
        orderId: newOrder.orderId,
        restaurantId: newOrder.restaurantId,
        customerLocation: newOrder.customerLocation,
        customerName: newOrder.customerName,
        customerAddress: newOrder.customerAddress,
        customerPhone: newOrder.customerPhone,
      };
    
      try {
        await orderService.createOrder(customerOrderDto);
      } catch (error) {
        console.error("Failed to create order on the server:", error);
      }
    };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const openMultiStagePopup = (order: Order) => {
    setSelectedOrder(order);
    setIsMultiStageModalVisible(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleMultiStageModalClose = () => {
    setIsMultiStageModalVisible(false);
    setSelectedOrder(null);
  };

  
  return (
    <div>
      <h1>Order Management</h1>
      <Button
        type="primary"
        onClick={addOrder}
        style={{ marginBottom: "20px" }}
      >
        Add Order
      </Button>
      <OrderTable
        orders={orders}
        updateOrderStatus={(orderId) =>
          openMultiStagePopup(
            orders.find((order) => order.orderId === orderId)!
          )
        }
      />
      <OrderDetailsPopup
        order={selectedOrder}
        visible={isDetailsModalVisible}
        onClose={handleDetailsModalClose}
      />
      <MultiStagePopup
        order={selectedOrder}
        visible={isMultiStageModalVisible}
        onClose={handleMultiStageModalClose}
        updateStatus={updateOrderStatus}
      />
    </div>
  );
};

export default OrderStatusManager;