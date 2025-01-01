import React from "react";
import { notification } from "antd";
import { motion } from "framer-motion";

interface NotificationProps {
  message: string;
  description: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const DEFAULT_DURATION = 4.5;
const DEFAULT_PLACEMENT: NotificationProps["placement"] = "topRight";

const NotificationWrapper = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "success" | "error" | "info" | "warning";
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`rounded-lg shadow-lg p-4 ${
        type === "success"
          ? "bg-green-50 border border-green-400 text-green-800"
          : type === "error"
          ? "bg-red-50 border border-red-400 text-red-800"
          : type === "info"
          ? "bg-blue-50 border border-blue-400 text-blue-800"
          : "bg-yellow-50 border border-yellow-400 text-yellow-800"
      }`}
    >
      {children}
    </motion.div>
  );
};

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
      <NotificationWrapper type={type}>
        <span className="font-bold text-lg">{message}</span>
      </NotificationWrapper>
    ),
    description: (
      <NotificationWrapper type={type}>
        <p className="text-sm text-gray-600">{description}</p>
      </NotificationWrapper>
    ),
    duration,
    placement,
    style: {
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      padding: "0",
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
