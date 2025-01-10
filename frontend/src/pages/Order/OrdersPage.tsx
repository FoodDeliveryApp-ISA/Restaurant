import React, { useState, useEffect } from "react";
import { Button } from "antd";
import OrderDetailsPopup from "./components/OrderDetailsPopup";
import OrderTable from "./components/OrderTable";
import MultiStagePopup from "./components/MultiStagePopup";

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

    const addOrder = () => {
        const newOrder: Order = {
          orderId: `ORD${orders.length + 1}`,
          restaurantLocation: [40.7128, -74.0060], // Example location for the restaurant (New York)
          customerLocation: [34.0522, -118.2437], // Example location for the customer (Los Angeles)
          customerName: `Customer ${orders.length + 1}`,
          customerAddress: "123 Main St",
          customerPhone: "0771234567",
        };
        setOrders([...orders, newOrder]);
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

  // Simulate state changes for other orders
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status !== "Delivered") {
            const currentIndex = statusFlow.indexOf(order.status);
            const nextStatus = statusFlow[currentIndex + 1] || order.status;
            return { ...order, status: nextStatus };
          }
          return order;
        })
      );
    }, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, []);

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