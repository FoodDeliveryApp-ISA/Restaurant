import React from "react";
import { Modal, Button } from "antd";

interface Order {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  status: string;
}

interface OrderDetailsPopupProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}

const OrderDetailsPopup: React.FC<OrderDetailsPopupProps> = ({
  order,
  visible,
  onClose,
}) => {
  return (
    <Modal
      title="Order Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {order ? (
        <div>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.customerName}
          </p>
          <p>
            <strong>Customer Address:</strong> {order.customerAddress}
          </p>
          <p>
            <strong>Customer Phone:</strong> {order.customerPhone}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
      ) : (
        <p>No order selected.</p>
      )}
    </Modal>
  );
};

export default OrderDetailsPopup;
