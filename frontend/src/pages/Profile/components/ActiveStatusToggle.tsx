import React, { useState } from "react";
import { Switch, Modal, message, Spin, Button } from "antd";

interface ActiveStatusToggleProps {
  active: boolean;
  onSave: (newStatus: boolean) => Promise<void>;
}

const ActiveStatusToggle: React.FC<ActiveStatusToggleProps> = ({
  active,
  onSave,
}) => {
  const [isActive, setIsActive] = useState(active);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(active);
  const [loading, setLoading] = useState(false);

  const handleToggle = (checked: boolean) => {
    setPendingStatus(checked);
    setIsModalVisible(true);
  };

  const confirmChange = async () => {
    setLoading(true);
    try {
      await onSave(pendingStatus);
      setIsActive(pendingStatus);
      message.success("Status updated successfully!");
    } catch {
      message.error("Failed to update status.");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        {/* <span className="mr-2">{isActive ? "Active" : "Inactive"}</span> */}
        <Switch
          checked={isActive}
          onChange={handleToggle}
          className="bg-red-500 dark:bg-red-600"
          checkedChildren="Open"
          unCheckedChildren="Close"
        />
      </div>
      <Modal
        title="Confirm Change"
        visible={isModalVisible}
        onOk={confirmChange}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            No
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={loading}
            onClick={confirmChange}
          >
            Yes
          </Button>,
        ]}
      >
        <p>Are you sure you want to change the active status?</p>
        {loading && <Spin />}
      </Modal>
    </>
  );
};

export default ActiveStatusToggle;
