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
  onClose: () => void;
  updateStatus: (orderId: string, newStatus: number) => void;
  refetchOrders: () => void;
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
      const stepIndex =
        statusFlow.find((step) => step.name === order.status)?.state || 1;
      setCurrentStep(stepIndex);
      setSelectedStatus(stepIndex);
      setIsCancelled(order.status === "ORDER_CANCELLED");
    }
  }, [order, visible]);

  const handleCancel = async () => {
    if (order) {
      try {
        setIsCancelled(true);
        await orderService.cancelOrder(order.orderId);
        message.error("The order has been cancelled.");
        refetchOrders();
        onClose();
      } catch {
        message.error("Failed to cancel the order. Please try again.");
      }
    }
  };

  const handleUpdate = async () => {
    if (!order) {
      message.error("No order found. Cannot update status.");
      console.error("Debug: Order object is undefined.");
      return;
    }
  
    if (!statusFlow[selectedStatus - 1]) {
      message.error("Invalid status selected. Please try again.");
      console.error(
        `Debug: Selected status (${selectedStatus}) does not map to a valid status in statusFlow.`
      );
      return;
    }
  
    console.log("Debug: Starting status update process...");
    console.log("Debug: Order ID:", order.orderId);
    console.log("Debug: Selected Status:", selectedStatus);
    console.log(
      "Debug: Status Title:",
      statusFlow[selectedStatus - 1]?.title
    );
  
    try {
      const response = await updateStatus(order.orderId, selectedStatus);
      console.log("Debug: Update status response:", response);
  
      message.success(
        `Order status updated to "${statusFlow[selectedStatus - 1]?.title}"`
      );
  
      console.log("Debug: Refetching orders...");
      await refetchOrders();
      console.log("Debug: Orders refetched successfully.");
    } catch (error) {
      console.error("Debug: Error during status update:", error);
      message.error(
        error?.response?.data?.message ||
          "Failed to update the order status. Please try again."
      );
    } finally {
      console.log("Debug: Closing the modal...");
      onClose();
    }
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
              <Button
                key="prev"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
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
                  console.log("Calling orderService.acceptOrder with:", order.orderId);
                  const response = await orderService.acceptOrder(order.orderId);
                  console.log("Response from acceptOrder:", response);
                  handleNext();
                  refetchOrders();
                  message.success("Order has been accepted.");
                } catch (error) {
                  console.error("Error in handleAcceptOrder:", error);
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
              handleMarkRiderAssigned={async () => {
                try {
                  await orderService.markRiderAssigned(order.orderId);
                  handleNext();
                  refetchOrders();
                  message.success("Rider assigned successfully.");
                } catch {
                  message.error("Failed to assign a rider. Please try again.");
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
              handleMarkPaid={async () => {
                try {
                  await orderService.markOrderPaid(order.orderId);
                  handleNext();
                  refetchOrders();
                  message.success("Order marked as 'Paid'.");
                } catch {
                  message.error("Failed to mark the order as 'Paid'. Please try again.");
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
