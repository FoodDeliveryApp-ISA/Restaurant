import React from "react";
import { notification } from "antd";
// import "antd/dist/antd.css"; // Import Ant Design styles

interface NotificationProps {
  message: string;
  description: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const DEFAULT_DURATION = 4.5;
const DEFAULT_PLACEMENT: NotificationProps["placement"] = "topRight";

const createNotification = (
  type: "success" | "error" | "info" | "warning",
  {
    message,
    description,
    duration = DEFAULT_DURATION,
    placement = DEFAULT_PLACEMENT,
  }: NotificationProps
) => {
  notification[type]({
    message: (
      <span
        style={{
          fontWeight: "bold",
          color: type === "error" ? "#ff4d4f" : "#1890ff",
          fontSize: "16px",
        }}
      >
        {message}
      </span>
    ),
    description: (
      <div
        style={{
          margin: 0,
          color: "#595959",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {description}
      </div>
    ),
    duration,
    placement,
    style: {
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  });
};

const ToastNotification = {
  success: (props: NotificationProps) => createNotification("success", props),
  error: (props: NotificationProps) => createNotification("error", props),
  info: (props: NotificationProps) => createNotification("info", props),
  warning: (props: NotificationProps) => createNotification("warning", props),
};

export default ToastNotification;
