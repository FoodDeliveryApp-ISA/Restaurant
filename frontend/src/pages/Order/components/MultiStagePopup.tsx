import React, { useState, useEffect } from "react";
import { Modal, Button, Steps, Card, message } from "antd";
import { statusFlow } from "../../../utils/statusFlow";
import {
  CheckCircleOutlined,
  FireOutlined,
  SearchOutlined,
  CarOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import OrderActions from "./OrderActions";
import orderService from "../../../services/order.service";

export interface Order {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  restaurantLocation: [number, number];
  customerLocation: [number, number];
  status: string;
}

interface MultiStagePopupProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
  updateStatus: (orderId: string, newStatus: string) => void;
}

const MultiStagePopup: React.FC<MultiStagePopupProps> = ({
  order,
  visible,
  onClose,
  updateStatus,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      const initialStep = statusFlow.findIndex(
        (step) => step.title === order.status
      );
      setCurrentStep(initialStep !== -1 ? initialStep : 0);
    }
  }, [order]);

  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, statusFlow.length - 1);
    setCurrentStep(nextStep);
    setSelectedStatus(statusFlow[nextStep].title);
  };

  const handlePrevious = () => {
    const previousStep = Math.max(currentStep - 1, 0);
    setCurrentStep(previousStep);
    setSelectedStatus(statusFlow[previousStep].title);
  };

  const handleUpdate = () => {
    if (order) {
      updateStatus(order.orderId, selectedStatus);
      message.success(`Order status updated to "${selectedStatus}"`);
    }
    onClose();
  };

  const handleAcceptOrder = async () => {
    if (order) {
      try {
        await orderService.acceptOrder(order.orderId);
        message.success("Order accepted!");
        handleNext();
      } catch (error) {
        message.error("Failed to accept order.");
      }
    }
  };

  const handleRejectOrder = async () => {
    if (order) {
      try {
        await orderService.cancelOrder(order.orderId);
        message.error("Order rejected.");
        onClose();
      } catch (error) {
        message.error("Failed to reject order.");
      }
    }
  };

  const handleRequestRider = async () => {
    if (order) {
      try {
        await orderService.requestRiders(order.orderId);
        message.success("Rider requested successfully!");
        handleNext();
      } catch (error) {
        message.error("Failed to request rider.");
      }
    }
  };

  const handleMarkOnTheWay = async () => {
    if (order) {
      try {
        await orderService.markOrderOnTheWay(order.orderId);
        message.success("Order marked as On the Way.");
        handleNext();
      } catch (error) {
        message.error("Failed to mark order as On the Way.");
      }
    }
  };

  const handleMarkDelivered = async () => {
    if (order) {
      try {
        await orderService.markOrderDelivered(order.orderId);
        message.success("Order marked as Delivered.");
        handleNext();
      } catch (error) {
        message.error("Failed to mark order as Delivered.");
      }
    }
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "check-circle":
        return <CheckCircleOutlined />;
      case "fire":
        return <FireOutlined />;
      case "search":
        return <SearchOutlined />;
      case "car":
        return <CarOutlined />;
      case "smile":
        return <SmileOutlined />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Order Management"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="prev" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>,
        <Button
          key="next"
          onClick={handleNext}
          disabled={currentStep === statusFlow.length - 1}
        >
          Next
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
      centered
    >
      {order ? (
        <Card
          bordered={false}
          style={{
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.customerName}
          </p>
          <p>
            <strong>Address:</strong> {order.customerAddress}
          </p>
          <p>
            <strong>Phone:</strong> {order.customerPhone}
          </p>
          <Steps current={currentStep} direction="vertical" style={{ marginTop: 20 }}>
            {statusFlow.map((step) => (
              <Steps.Step
                key={step.title}
                title={step.title}
                icon={getStepIcon(step.icon)}
                description={step.description}
              />
            ))}
          </Steps>
          <OrderActions
            currentStep={currentStep}
            handleAcceptOrder={handleAcceptOrder}
            handleRejectOrder={handleRejectOrder}
            handleRequestRider={handleRequestRider}
            handleMarkDelivered={handleMarkDelivered}
            handleMarkOnTheWay={handleMarkOnTheWay}
          />
        </Card>
      ) : (
        <p>No order selected.</p>
      )}
    </Modal>
  );
};

export default MultiStagePopup;
