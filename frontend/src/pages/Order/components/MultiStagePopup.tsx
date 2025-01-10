import React from "react";
import { Modal, Select, Button } from "antd";

interface MultiStagePopupProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
  updateStatus: (orderId: string, newStatus: string) => void;
}

const statusFlow = [
  "Order Created",
  "Cooking",
  "Searching Rider",
  "Out for Delivery",
  "Delivered",
];

const MultiStagePopup: React.FC<MultiStagePopupProps> = ({
  order,
  visible,
  onClose,
  updateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  React.useEffect(() => {
    if (order) setSelectedStatus(order.status);
  }, [order]);

  const handleStatusChange = (value: string) => setSelectedStatus(value);

  const handleUpdate = () => {
    if (order) updateStatus(order.orderId, selectedStatus);
    onClose();
  };

  return (
    <Modal
      title="Update Order Status"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      {order ? (
        <div>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ width: "100%" }}
          >
            {statusFlow.map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </div>
      ) : (
        <p>No order selected.</p>
      )}
    </Modal>
  );
};

export default MultiStagePopup;
