// src/components/LogoutConfirmationModal.tsx
import React from "react";
import { Modal } from "antd";

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      title="Confirm Logout"
      visible={isVisible}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Yes, Logout"
      cancelText="Cancel"
      className="bg-white" // Optional: You can customize the modal styles with Tailwind
    >
      <p>Are you sure you want to log out?</p>
    </Modal>
  );
};

export default LogoutConfirmationModal;
