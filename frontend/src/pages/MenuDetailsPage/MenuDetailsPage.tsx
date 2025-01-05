import React from "react";
import { useParams } from "react-router-dom";
import MenuItemsTable from "./components/MenuItemsTable";
import MenuEdit from "./components/MenuEdit"; // Import MenuItemDetailPage

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
      {/* Menu Items Table */}

      {/* Menu Item Detail (Edit Section) */}
      <div className="mt-8">
        <MenuEdit menuId={menuIdNumber} />
      </div>
      <MenuItemsTable menuId={menuIdNumber} />
    </div>
  );
};

export default MenuDetailsPage;
