import React, { useState, useEffect } from "react";
import { Button, Select, Row, Col, Space } from "antd";
import OrderTable from "./components/OrderTable";
import MultiStagePopup from "./components/MultiStagePopup";
import orderService from "../../services/order.service";

export interface Order {
  orderId: string;
  restaurantId: string; // Added restaurantId to track by restaurant
  restaurantLocation: [number, number];
  customerLocation: [number, number];
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  status: string; // Ensure status is a string
  createdDate?: string;
}

const { Option } = Select;

const statusMapping: Record<number, string> = {
  0: "ORDER_PLACED",
  1: "PREPARING",
  2: "ASSIGNING_RIDER",
  3: "ON_THE_WAY",
  4: "ORDER_DELIVERED",
  5: "ORDER_CANCELLED",
};

const OrderStatusManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMultiStageModalVisible, setIsMultiStageModalVisible] =
    useState(false);
  const [statuses, setStatuses] = useState<string[]>(["ORDER_PLACED", "PREPARING"]);
  const [sortBy, setSortBy] = useState<string>("createdDate");
  const [ascending, setAscending] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>("2h"); // Default time range

  const addOrder = async () => {
    const restaurantIds = ["353"];
    const randomRestaurantId =
      restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
  
    const newOrder: Order = {
      orderId: `ORD${orders.length + 1}`,
      restaurantId: randomRestaurantId,
      restaurantLocation: [40.7128, -74.0060], // Example restaurant location
      customerLocation: [34.0522, -118.2437], // Example customer location
      customerName: `Customer ${orders.length + 1}`, // Dynamic customer name
      customerAddress: "789 Customer Ave, Client City, CC 67890", // Example customer address
      customerPhone: "0771234567", // Example customer phone
      status: "ORDER_PLACED", // Default status
      createdDate: new Date().toISOString(), // Add creation date
    };
  
    // Generate dummy order items
    const orderItems = [
      { menuItemId: "40", quantity: 2 },
      { menuItemId: "39", quantity: 1 },
    ];
  
    const customerOrderDto = {
      orderId: newOrder.orderId,
      restaurantId: randomRestaurantId,
      customerLocation: newOrder.customerLocation,
      customerName: newOrder.customerName,
      customerAddress: newOrder.customerAddress,
      customerPhone: newOrder.customerPhone,
      orderItems: orderItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })), // Ensure no nested `order` references
      orderDate: new Date(), // Include order date
    };
    
    setOrders([...orders, newOrder]);
  
    try {
      await orderService.createOrder(customerOrderDto);
      console.log("Order successfully created:", customerOrderDto);
    } catch (error) {
      console.error("Failed to create order on the server:", error);
    }
  };
  

  const fetchOrders = async () => {
    try {
      const restaurantId = "353";
      const fetchedOrders = await orderService.getOrdersByRestaurantId(
        restaurantId,
        sortBy,
        ascending,
        statuses,
        timeRange // Include timeRange in the request
      );
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statuses, sortBy, ascending, timeRange]); // Fetch orders when any filter changes

  const openMultiStagePopup = (order: Order) => {
    setSelectedOrder(order);
    setIsMultiStageModalVisible(true);
  };

  const handleMultiStageModalClose = () => {
    setIsMultiStageModalVisible(false);
    setSelectedOrder(null);
    fetchOrders(); // Refetch orders to ensure the latest data
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <h1>Order Management</h1>
        </Col>
        <Col>
          <Space size="middle">
            <Button type="primary" onClick={addOrder}>
              Add Order
            </Button>
            <Select
              mode="multiple"
              placeholder="Filter by Status"
              style={{ minWidth: 200 }}
              onChange={(value: string[]) => setStatuses(value)}
              defaultValue={["ORDER_PLACED", "PREPARING"]} // Default selected filters
            >
              <Option value="ORDER_PLACED">Order Placed</Option>
              <Option value="PREPARING">Preparing</Option>
              <Option value="ASSIGNING_RIDER">Assigning Rider</Option> {/* New status */}
              <Option value="ON_THE_WAY">On the Way</Option>
              <Option value="ORDER_DELIVERED">Delivered</Option>
              <Option value="ORDER_CANCELLED">Cancelled</Option>
            </Select>
            <Select
              placeholder="Sort By"
              style={{ width: 150 }}
              onChange={(value: string) => setSortBy(value)}
              defaultValue="createdDate"
            >
              <Option value="createdDate">Created Date</Option>
              <Option value="status">Status</Option>
            </Select>
            <Select
              placeholder="Sort Order"
              style={{ width: 150 }}
              onChange={(value: string) => setAscending(value === "asc")}
              defaultValue="asc"
            >
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>
            </Select>
            <Select
              placeholder="Time Range"
              style={{ width: 150 }}
              onChange={(value: string) => setTimeRange(value)}
              defaultValue="2h"
            >
              <Option value="1h">Last 1 Hour</Option>
              <Option value="2h">Last 2 Hours</Option>
              <Option value="6h">Last 6 Hours</Option>
              <Option value="24h">Last 24 Hours</Option>
              <Option value="7d">Last 7 Days</Option>
              <Option value="1m">Last 1 Month</Option>
              <Option value="all">All Time</Option>
            </Select>
          </Space>
        </Col>
      </Row>
      <OrderTable
        orders={orders}
        updateOrderStatus={(orderId) =>
          openMultiStagePopup(
            orders.find((order) => order.orderId === orderId)!
          )
        }
      />
      <MultiStagePopup
        order={selectedOrder}
        visible={isMultiStageModalVisible}
        onClose={handleMultiStageModalClose}
        updateStatus={(orderId, newStatus) => {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId
                ? { ...order, status: statusMapping[newStatus] }
                : order
            )
          );
        }}
      />
    </div>
  );
};

export default OrderStatusManager;
