import React from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Alert } from "antd";
import MenuItemsTable from "./components/MenuItemsTable";
import MenuEdit from "./components/MenuEdit";

const { Title } = Typography;

const MenuDetailsPage: React.FC = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const menuIdNumber = parseInt(menuId, 10);

  if (isNaN(menuIdNumber)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Alert
          message="Error"
          description="Invalid menu ID provided. Please check the URL and try again."
          type="error"
          showIcon
          style={{ maxWidth: "400px", margin: "auto" }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Edit Menu Details Section */}
      <Card
        title="Edit Menu"
        bordered={true}
        style={{ marginBottom: "1.5rem" }}
        headStyle={{ fontSize: "1.25rem", fontWeight: "bold" }}
      >
        <MenuEdit menuId={menuIdNumber} />
      </Card>

      {/* Menu Items Section */}
      <Card
        title="Menu Items"
        bordered={true}
        headStyle={{ fontSize: "1.25rem", fontWeight: "bold" }}
      >
        <MenuItemsTable menuId={menuIdNumber} />
      </Card>
    </div>
  );
};

export default MenuDetailsPage;
