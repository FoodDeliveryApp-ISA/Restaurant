import { FC } from "react";
import { notification, Button, Space, Typography, Row, Col } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import orderService from "../../../services/order.service";
const { Text } = Typography;

interface CustomPopupProps {
  message: string;
  onClose: () => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  customClassName?: string;
  index: number; // To determine stack position
}

const CustomPopup: FC<CustomPopupProps> = ({
  message,
  onClose,
  onAccept,
  onReject,
  customClassName,
  index,
}) => {
  const [api, contextHolder] = notification.useNotification();

 
  // Extract the order ID from the message
  const extractOrderId = (msg: string): string | null => {
    const match = msg.match(/#(ORD\d+)/);
    return match ? match[1] : null;
  };

  const orderId = extractOrderId(message);

  const openNotification = (pauseOnHover: boolean) => {
    const key = `notification-${index}`;
    api.open({
      message: (
        <Row align="middle" gutter={8}>
          <Col>
            <ShoppingCartOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
          </Col>
          <Col>
            <Text strong style={{ fontSize: "16px" }}>
              New Order Received
            </Text>
          </Col>
        </Row>
      ),
      description: (
        <div style={{ marginTop: 8 }}>
          <Text style={{ fontSize: "14px", lineHeight: "1.5" }}>{message}</Text>
          <div style={{ marginTop: 16 }}>
            <Space size="large" style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="middle"
                style={{ width: 120 }}
                onClick={() => {
                  if (orderId) onAccept(orderId);
                  notification.close(key);
                }}
              >
                Accept
              </Button>
              <Button
                type="default"
                icon={<CloseCircleOutlined />}
                size="middle"
                style={{ width: 120 }}
                onClick={() => {
                  if (orderId) onReject(orderId);
                  notification.close(key);
                }}
              >
                Reject
              </Button>
            </Space>
          </div>
        </div>
      ),
      key,
      className: customClassName,
      duration: 5, // Auto-close after 5 seconds
      showProgress: true, // Show built-in progress bar
      pauseOnHover, // Pause progress bar on hover
      onClose,
      placement: "topLeft", // Set placement to top-left
    });
  };

  // Trigger the notification on render
  openNotification(true);

  return <>{contextHolder}</>;
};

export default CustomPopup;
