import React from "react";
import { Switch, Modal, message } from "antd";

interface ActiveButtonProps {
  active: boolean;
  setActive: (value: boolean) => void;
  handleSave: () => void;
}

const ActiveButton: React.FC<ActiveButtonProps> = ({
    active,
    setActive,
    handleSave,
  }) => {
    const confirmToggleActive = () => {
      Modal.confirm({
        title: active ? "Deactivate Item?" : "Activate Item?",
        content: `Are you sure you want to ${
          active ? "deactivate" : "activate"
        } this menu item?`,
        onOk: async () => {
          const newActiveState = !active;
          setActive(newActiveState);
  
          // Pass both updated states explicitly
          await handleSave(undefined, newActiveState);
          message.success(
            `Menu item ${active ? "deactivated" : "activated"}!`
          );
        },
      });
    };
  
    return (
      <div>
        <Switch checked={active} onChange={confirmToggleActive} className="mr-2" />
        <span>{active ? "Active" : "Inactive"}</span>
      </div>
    );
  };
  
  export default ActiveButton;
  