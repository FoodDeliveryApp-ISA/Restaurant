import React from "react";
import { Table, Button, Tag, Tooltip, message } from "antd";
import { 
  CheckCircleOutlined, 
  SyncOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined, 
  CarOutlined, 
  SmileOutlined, 
  DollarOutlined,
  FileAddOutlined // New icon for "CREATED"
} from "@ant-design/icons";

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
  const statusInfo: Record<string, { color: string; icon: React.ReactNode }> = {
    // CREATED: { color: "gray", icon: <FileAddOutlined /> }, // New "CREATED" statu
    PENDING: { color: "orange", icon: <ClockCircleOutlined /> },
    CANCELLED: { color: "red", icon: <CloseCircleOutlined /> },
    PLACED: { color: "blue", icon: <SyncOutlined spin /> },
    PREPARED: { color: "purple", icon: <CheckCircleOutlined /> },
    RIDER_ASSIGNED: { color: "cyan", icon: <CarOutlined /> },
    RIDER_PICKED: { color: "gold", icon: <CarOutlined /> },
    DELIVERED: { color: "green", icon: <SmileOutlined /> },
    PAID: { color: "lime", icon: <DollarOutlined /> },
  };

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
        const { color, icon } = statusInfo[status] || { color: "gray", icon: null };

        return (
          <Tooltip title={status}>
            <Tag color={color} icon={icon}>
              {status}
            </Tag>
          </Tooltip>
        );
      },
      filters: Object.keys(statusInfo).map((key) => ({ text: key, value: key })),
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
