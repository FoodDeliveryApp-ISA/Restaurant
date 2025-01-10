import React from "react";
import { Table, Button, Tag } from "antd";

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
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          "Order Created": "orange",
          "Rider Selected": "blue",
          "Out for Delivery": "cyan",
          Delivered: "green",
        };
        return <Tag color={colors[status] || "gray"}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Button
          type="primary"
          onClick={() => updateOrderStatus(record.orderId)}
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
    />
  );
};

export default OrderTable;
