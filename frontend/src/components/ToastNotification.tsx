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
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const createNotification = (
  type: "success" | "error" | "info" | "warning",
  { message, description, duration = DEFAULT_DURATION, placement = DEFAULT_PLACEMENT }: NotificationProps
) => {
  notification[type]({
    message: <NotificationWrapper type={type}><span>{message}</span></NotificationWrapper>,
    description: <NotificationWrapper type={type}><p>{description}</p></NotificationWrapper>,
    duration,
    placement,
  });
};

const ToastNotification = {
  success: (props: NotificationProps) => createNotification("success", props),
  error: (props: NotificationProps) => createNotification("error", props),
  info: (props: NotificationProps) => createNotification("info", props),
  warning: (props: NotificationProps) => createNotification("warning", props),
};

export default ToastNotification;
