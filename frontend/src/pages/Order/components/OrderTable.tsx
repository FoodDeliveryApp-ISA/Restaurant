import React from "react";
import { Table, Button, Tag, Tooltip, message } from "antd";
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface Order {
  orderId: string;
  customerName: string;
  status: string;
}

interface OrderTableProps {
  orders: Order[];
  updateOrderStatus: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, updateOrderStatus }) => {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a: Order, b: Order) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ellipsis: true,
      sorter: (a: Order, b: Order) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusInfo: Record<string, { color: string; icon: React.ReactNode }> = {
          ORDER_PLACED: { color: "orange", icon: <SyncOutlined spin /> },
          PREPARING: { color: "blue", icon: <CheckCircleOutlined /> },
          ASSIGNING_RIDER: { color: "cyan", icon: <SyncOutlined /> },
          ON_THE_WAY: { color: "green", icon: <CheckCircleOutlined /> },
          ORDER_DELIVERED: { color: "green", icon: <CheckCircleOutlined /> },
          ORDER_CANCELLED: { color: "red", icon: <CloseCircleOutlined /> },
        };
             

        console.log("Status:", status, "Info:", statusInfo[status]);

        const { color, icon } = statusInfo[status] || { color: "gray", icon: null };

        return (
          <Tooltip title={status}>
            <Tag color={color} icon={icon}>
              {status}
            </Tag>
          </Tooltip>
        );
      },
      filters: [
        { text: "Order Created", value: "Order Created" },
        { text: "Rider Selected", value: "Rider Selected" },
        { text: "Out for Delivery", value: "Out for Delivery" },
        { text: "Delivered", value: "Delivered" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value: string, record: Order) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Button
          type="primary"
          onClick={() => {
            updateOrderStatus(record.orderId);
            message.success(`Status update initiated for Order ID: ${record.orderId}`);
          }}
        >
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="orderId"
      pagination={{ pageSize: 5 }}
      bordered
    />
  );
};

export default OrderTable;
