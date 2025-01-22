import { useState, useEffect } from "react";
import { statusFlow } from "../utils/statusFlow";
// import { Order } from "../types/order.types";
export interface Order {
    orderId: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    restaurantLocation: [number, number];
    customerLocation: [number, number];
    status: string;
  }

const useOrderSync = (
  order: Order | null,
  updateStatus: (orderId: string, newStatus: string) => void
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (order) {
      const initialStep = statusFlow.findIndex(
        (step) => step.title === order.status
      );
      setCurrentStep(initialStep !== -1 ? initialStep : 0);
      setSelectedStatus(order.status);
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

  const handleStatusUpdate = (newStatus: string) => {
    if (order) {
      updateStatus(order.orderId, newStatus);
      setSelectedStatus(newStatus);
    }
  };

  return {
    currentStep,
    selectedStatus,
    handleNext,
    handlePrevious,
    handleStatusUpdate,
  };
};

export default useOrderSync;
