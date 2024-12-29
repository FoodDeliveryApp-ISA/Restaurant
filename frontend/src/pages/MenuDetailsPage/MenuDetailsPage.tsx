// src/pages/MenuDetailsPage/MenuDetailsPage.tsx

import React from "react";
import { Button } from "antd";
import MenuItemsTable from "./components/MenuItemsTable";
import { useParams } from "react-router-dom";

const MenuDetailsPage: React.FC = () => {
  // Extract menuId from the URL using useParams
  const { menuId } = useParams<{ menuId: string }>();
  console.log("Menu ID:", menuId);
  // Convert menuId to a number (assuming it should be numeric)
  const menuIdNumber = parseInt(menuId, 10);
  console.log("Menu ID (number):", menuIdNumber);

  if (isNaN(menuIdNumber)) {
    return <div>Error: Invalid menu ID</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Details</h1>
      <MenuItemsTable menuId={menuIdNumber} />{" "}
      {/* Pass the numeric menuId to MenuItemsTable */}
    </div>
  );
};

export default MenuDetailsPage;
