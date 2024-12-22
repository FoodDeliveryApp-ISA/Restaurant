import React from "react";
import { Button } from "antd";

interface ActiveButtonProps {
  active: boolean;
  onClick: () => void;
}

const ActiveButton: React.FC<ActiveButtonProps> = ({ active, onClick }) => {
  return (
    <Button type="primary" onClick={onClick}>
      {active ? "Active" : "Inactive"}
    </Button>
  );
};

export default ActiveButton;
