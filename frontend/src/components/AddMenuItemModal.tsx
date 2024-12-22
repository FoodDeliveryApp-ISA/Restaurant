import React from "react";
import { Modal, Input } from "antd";

interface AddMenuItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (item: { name: string; description: string }) => void;
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSave = () => {
    onSave({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <Modal
      title="Add Menu Item"
      visible={visible}
      onOk={handleSave}
      onCancel={onCancel}
    >
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input.TextArea
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Modal>
  );
};

export default AddMenuItemModal;
