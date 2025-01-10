import React from "react";
import { Button, Tooltip } from "antd";
import { CheckCircleOutlined, FireOutlined, SearchOutlined } from "@ant-design/icons";

interface OrderActionsProps {
  handleAcceptOrder: () => void;
  handleRejectOrder: () => void;
  handleRequestRider: () => void;
  currentStep: number;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  handleAcceptOrder,
  handleRejectOrder,
  handleRequestRider,
  currentStep,
}) => {
  return (
    <div style={{ marginTop: 20, display: "flex", gap: "10px" }}>
      {currentStep === 0 && (
        <>
          <Tooltip title="Accept the order">
            <Button
              type="primary"
              onClick={handleAcceptOrder}
              style={{ flex: 1 }}
              icon={<CheckCircleOutlined />}
            >
              Accept Order
            </Button>
          </Tooltip>
          <Tooltip title="Reject the order">
            <Button
              danger
              onClick={handleRejectOrder}
              style={{ flex: 1 }}
              icon={<FireOutlined />}
            >
              Reject Order
            </Button>
          </Tooltip>
        </>
      )}
      {currentStep === 1 && (
        <Tooltip title="Request a delivery partner">
          <Button
            type="primary"
            onClick={handleRequestRider}
            style={{ flex: 1 }}
            icon={<SearchOutlined />}
          >
            Request Rider
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default OrderActions;
