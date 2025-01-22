import React, { useState } from "react";
import { Switch, Modal, message, Spin, Button, Typography, Badge, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
      <div className="flex items-center gap-4">
        <Tooltip title={isActive ? "Currently active" : "Currently inactive"}>
          <Badge
            status={isActive ? "success" : "default"}
            text={<Text>{isActive ? "Active" : "Inactive"}</Text>}
          />
        </Tooltip>
        <Switch
          checked={isActive}
          onChange={handleToggle}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      </div>

      <Modal
        title="Confirm Status Change"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={loading}
            onClick={confirmChange}
            icon={loading ? <LoadingOutlined /> : null}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to change the status to{" "}
          <Text strong>{pendingStatus ? "Active" : "Inactive"}</Text>?
        </p>
        {loading && (
          <div className="text-center">
            <Spin />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ActiveStatusToggle;
