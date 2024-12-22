import React, { useState } from "react";
import { Card, Button } from "antd";
import { useParams } from "react-router-dom";
import MenuItemsTable from "../../components/MenuItemsTable";
import AddModal from "../../components/AddModal";
import EditModal from "../../components/EditModal";

interface MenuItem {
  key: string;
  name: string;
  description: string;
  active: boolean;
}

const MenuDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      key: "1",
      name: "Pancakes",
      description: "Fluffy pancakes",
      active: true,
    },
  ]);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddItem = (item: MenuItem) => {
    setMenuItems((prev) => [
      ...prev,
      { ...item, key: String(prev.length + 1) },
    ]);
    setIsAddModalVisible(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((menuItem) => (menuItem.key === item.key ? item : menuItem))
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (key: string) => {
    setMenuItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleToggleActive = (key: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, active: !item.active } : item
      )
    );
  };

  return (
    <div className="menu-details-page">
      <Card
        title={`Menu Items - Menu ID: ${id}`}
        extra={
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            Add Menu Item
          </Button>
        }
      >
        <MenuItemsTable
          items={menuItems}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDeleteItem}
          onToggleActive={handleToggleActive}
        />
      </Card>

      <AddModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSave={handleAddItem}
      />

      {editingItem && (
        <EditModal
          visible={!!editingItem}
          item={editingItem}
          onCancel={() => setEditingItem(null)}
          onSave={handleEditItem}
        />
      )}
    </div>
  );
};

export default MenuDetailsPage;
