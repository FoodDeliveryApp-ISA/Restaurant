import { notification, NotificationPlacement } from "antd";

interface NotificationProps {
  message: string;
  description: string;
  duration?: number;
  placement?: NotificationPlacement;
}

const ToastNotification = {
  success: ({
    message,
    description,
    duration = 4.5,
    placement = "topRight",
  }: NotificationProps) => {
    notification.success({
      message,
      description,
      duration,
      placement,
    });
  },

  error: ({
    message,
    description,
    duration = 4.5,
    placement = "topRight",
  }: NotificationProps) => {
    notification.error({
      message,
      description,
      duration,
      placement,
    });
  },

  info: ({
    message,
    description,
    duration = 4.5,
    placement = "topRight",
  }: NotificationProps) => {
    notification.info({
      message,
      description,
      duration,
      placement,
    });
  },

  warning: ({
    message,
    description,
    duration = 4.5,
    placement = "topRight",
  }: NotificationProps) => {
    notification.warning({
      message,
      description,
      duration,
      placement,
    });
  },
};

export default ToastNotification;
