import React, { useState, useEffect } from "react";
import { Button, Select, Row, Col, Space } from "antd";
import OrderTable from "./components/OrderTable";
import MultiStagePopup from "./components/MultiStagePopup";
import orderService from "../../services/order.service";
import TokenUtil from "../../utils/tokenUtil";

export interface Order {
  orderId: string;
  restaurantId: string;
  restaurantLocation: [number, number];
  customerLocation: [number, number];
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  status: string;
  createdDate?: string;
}

const { Option } = Select;

const statusMapping: Record<number, string> = {
  0: "PENDING",
  1: "PLACED",
  2: "PREPARED",
  3: "PREPARED",
  4: "RIDER_ASSIGNED",
  5: "RIDER_PICKED",
  6: "DELIVERED",
  7: "PAID",
  8: "CANCELLED", // Added CREATED status mapping
};

const OrderStatusManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMultiStageModalVisible, setIsMultiStageModalVisible] =
    useState(false);
  const [statuses, setStatuses] = useState<string[]>(["PENDING", "PLACED"]);
  const [sortBy, setSortBy] = useState<string>("createdDate");
  const [ascending, setAscending] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>("2h");

  const addOrder = async () => {
    // Retrieve restaurantId from TokenUtil
    const restaurantId = TokenUtil.getRestaurantId();

    if (!restaurantId) {
      console.error("Restaurant ID not found in token");
      return;
    }

    const newOrder: Order = {
      orderId: `ORD${orders.length + 1}`,
      restaurantId: String(restaurantId),
      restaurantLocation: [40.7128, -74.0060], // Example location
      customerLocation: [34.0522, -118.2437], // Example location
      customerName: `Customer ${orders.length + 1}`,
      customerAddress: "789 Customer Ave, Client City, CC 67890",
      customerPhone: "0771234567",
      status: "PENDING", // Default status
      createdDate: new Date().toISOString(),
    };

    const orderItems = [
      { menuItemId: "40", quantity: 2 },
      { menuItemId: "39", quantity: 1 },
    ];

    const customerOrderDto = {
      orderId: newOrder.orderId,
      restaurantId: restaurantId,
      customerLocation: newOrder.customerLocation,
      customerName: newOrder.customerName,
      customerAddress: newOrder.customerAddress,
      customerPhone: newOrder.customerPhone,
      orderItems: orderItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
      orderDate: new Date(),
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
      const restaurantId = TokenUtil.getRestaurantId();
      const fetchedOrders = await orderService.getOrdersByRestaurantId(
        restaurantId,
        sortBy,
        ascending,
        statuses,
        timeRange
      );
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statuses, sortBy, ascending, timeRange]);

  const openMultiStagePopup = (order: Order) => {
    setSelectedOrder(order);
    setIsMultiStageModalVisible(true);
  };

  const handleMultiStageModalClose = () => {
    setIsMultiStageModalVisible(false);
    setSelectedOrder(null);
    fetchOrders();
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
              defaultValue={["PENDING", "PLACED"]}
            >
              <Option value="PENDING">Pending</Option>
              <Option value="CANCELLED">Cancelled</Option>
              <Option value="PLACED">Placed</Option>
              <Option value="PREPARED">Prepared</Option>
              <Option value="RIDER_ASSIGNED">Rider Assigned</Option>
              <Option value="RIDER_PICKED">Rider Picked</Option>
              <Option value="DELIVERED">Delivered</Option>
              <Option value="PAID">Paid</Option>
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
        refetchOrders={fetchOrders}
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
