import React from "react";
import { Button, Tooltip, Card } from "antd";
import {
  CheckCircleOutlined,
  FireOutlined,
  SearchOutlined,
  CarOutlined,
  SmileOutlined,
  UserSwitchOutlined,
  DollarOutlined,
} from "@ant-design/icons";

interface OrderActionsProps {
  handleAcceptOrder: () => void;
  handleRejectOrder: () => void;
  handleRequestRider: () => void;
  handleMarkRiderAssigned: () => void;
  handleMarkOnTheWay: () => void;
  handleMarkDelivered: () => void;
  handleMarkPaid: () => void;
  currentStep: number;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  handleAcceptOrder,
  handleRejectOrder,
  handleRequestRider,
  handleMarkRiderAssigned,
  handleMarkOnTheWay,
  handleMarkDelivered,
  handleMarkPaid,
  currentStep,
}) => {
  return (
    <Card
      style={{
        marginTop: 20,
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
      }}
      bodyStyle={{ padding: "10px" }}
      bordered={false}
    >
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {currentStep === 0 && (
          <>
            <Tooltip title="Accept the order">
              <Button
                type="primary"
                size="large"
                onClick={handleAcceptOrder}
                icon={<CheckCircleOutlined />}
                style={{
                  minWidth: "150px",
                }}
              >
                Accept Order
              </Button>
            </Tooltip>
            <Tooltip title="Reject the order">
              <Button
                danger
                size="large"
                onClick={handleRejectOrder}
                icon={<FireOutlined />}
                style={{
                  minWidth: "150px",
                }}
              >
                Reject Order
              </Button>
            </Tooltip>
          </>
        )}
        {currentStep === 1 && (
          <>
          <Tooltip title="Request a delivery partner">
            <Button
              type="primary"
              size="large"
              onClick={handleRequestRider}
              icon={<SearchOutlined />}
              style={{
                minWidth: "200px",
              }}
            >
              Request Rider
            </Button>
          </Tooltip>
          <Tooltip title="Reject the order">
              <Button
                danger
                size="large"
                onClick={handleRejectOrder}
                icon={<FireOutlined />}
                style={{
                  minWidth: "150px",
                 }}
                >
                  Reject Order
                </Button>
            </Tooltip>
          </>
        )}
        {/* {currentStep === 2 && (
          <Tooltip title="Assign a rider to the order">
            <Button
              type="primary"
              size="large"
              onClick={handleMarkRiderAssigned}
              icon={<UserSwitchOutlined />}
              style={{
                minWidth: "200px",
              }}
            >
              Assign Rider
            </Button>
          </Tooltip>
        )}
        {currentStep === 3 && (
          <Tooltip title="Mark order as On the Way">
            <Button
              type="primary"
              size="large"
              onClick={handleMarkOnTheWay}
              icon={<CarOutlined />}
              style={{
                minWidth: "200px",
              }}
            >
              Mark On the Way
            </Button>
          </Tooltip>
        )}
        {currentStep === 4 && (
          <Tooltip title="Mark order as Delivered">
            <Button
              type="primary"
              size="large"
              onClick={handleMarkDelivered}
              icon={<SmileOutlined />}
              style={{
                minWidth: "200px",
              }}
            >
              Mark Delivered
            </Button>
          </Tooltip>
        )}
        {currentStep === 5 && (
          <Tooltip title="Mark order as Paid">
            <Button
              type="primary"
              size="large"
              onClick={handleMarkPaid}
              icon={<DollarOutlined />}
              style={{
                minWidth: "200px",
              }}
            >
              Mark Paid
            </Button>
          </Tooltip>
        )} */}
      </div>
    </Card>
  );
};

export default OrderActions;
