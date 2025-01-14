import React, { useEffect, useState } from "react";
import { Modal, Button, message, Collapse, Typography } from "antd";
import OrderDetails from "./OrderDetails";
import StepsWithIcons from "./StepsWithIcons";
import OrderActions from "./OrderActions";
import orderService from "../../../services/order.service";
import { Order } from "./order.type";
import { statusFlow } from "../../../utils/statusFlow";

const { Panel } = Collapse;
const { Text } = Typography;

interface MultiStagePopupProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void; // Callback to trigger after modal close
  updateStatus: (orderId: string, newStatus: number) => void;
  refetchOrders: () => void; // New prop to trigger data refresh
}

const MultiStagePopup: React.FC<MultiStagePopupProps> = ({
  order,
  visible,
  onClose,
  updateStatus,
  refetchOrders,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (order && visible) {
      console.log(order.status);
      // console.log();
      const stepIndex = statusFlow.find((step) => step.name === order.status)?.state || 1;
      setCurrentStep(stepIndex);
      setSelectedStatus(stepIndex);
      console.log(currentStep);
      console.log(selectedStatus);
      setIsCancelled(order.status === "ORDER_CANCELLED");
    }
  }, [order, visible]);

  const handleCancel = async () => {
    if (order) {
      setIsCancelled(true);
      updateStatus(order.orderId, 6); // ORDER_CANCELLED
      await orderService.cancelOrder(order.orderId);
      await message.error("The order has been cancelled.");
      refetchOrders();
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (order) {
      updateStatus(order.orderId, selectedStatus);
      await message.success(
        `Order status updated to "${statusFlow[selectedStatus - 1]?.title}"`
      );
      refetchOrders();
    }
    onClose();
  };

  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, statusFlow.length);
    setCurrentStep(nextStep);
    setSelectedStatus(nextStep);
  };

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    setSelectedStatus(prevStep);
  };

  return (
    <Modal
      title={isCancelled ? "Order Cancelled" : "Order Management"}
      visible={visible}
      onCancel={onClose}
      footer={
        isCancelled
          ? [
              <Button key="close" onClick={onClose}>
                Close
              </Button>,
            ]
          : [
              <Button key="prev" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>,
              <Button
                key="next"
                onClick={handleNext}
                disabled={currentStep === statusFlow.length}
              >
                Next
              </Button>,
              <Button key="cancel" danger onClick={handleCancel}>
                Cancel Order
              </Button>,
              <Button key="update" type="primary" onClick={handleUpdate}>
                Update
              </Button>,
            ]
      }
      centered
    >
      {order ? (
        isCancelled ? (
          <div>
            <Text type="danger">
              This order has been cancelled. No further actions can be taken.
            </Text>
            <OrderDetails order={order} />
          </div>
        ) : (
          <>
            <Collapse defaultActiveKey={[]} style={{ marginBottom: "16px" }}>
              <Panel header="Order Details" key="1">
                <OrderDetails order={order} />
              </Panel>
            </Collapse>
            <StepsWithIcons currentStep={currentStep - 1} />
            <OrderActions
              currentStep={currentStep - 1}
              handleAcceptOrder={async () => {
                try {
                  await orderService.acceptOrder(order.orderId);
                  handleNext();
                  refetchOrders();
                  message.success("Order has been accepted.");
                } catch {
                  message.error("Failed to accept the order. Please try again.");
                }
              }}
              handleRejectOrder={handleCancel}
              handleRequestRider={async () => {
                try {
                  await orderService.requestRiders(order.orderId);
                  handleNext();
                  refetchOrders();
                  message.success("Rider requested successfully.");
                } catch {
                  message.error("Failed to request a rider. Please try again.");
                }
              }}
              handleMarkOnTheWay={async () => {
                try {
                  await orderService.markOrderOnTheWay(order.orderId);
                  handleNext();
                  refetchOrders();
                  message.success("Order marked as 'On the Way'.");
                } catch {
                  message.error("Failed to mark the order as 'On the Way'. Please try again.");
                }
              }}
              handleMarkDelivered={async () => {
                try {
                  await orderService.markOrderDelivered(order.orderId);
                  handleNext();
                  refetchOrders();
                  message.success("Order marked as 'Delivered'.");
                } catch {
                  message.error("Failed to mark the order as 'Delivered'. Please try again.");
                }
              }}
            />
          </>
        )
      ) : (
        <p>No order selected.</p>
      )}
    </Modal>
  );
};

export default MultiStagePopup;
