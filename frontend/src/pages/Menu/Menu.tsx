import React, { useState } from "react";
import { Card, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import MenuTable from "../../components/MenuTable";
import AddModal from "../../components/AddModal";
import EditModal from "../../components/EditModal";

interface Menu {
  key: string;
  name: string;
  description: string;
}

const MenusPage: React.FC = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([
    { key: "1", name: "Breakfast Menu", description: "Morning meals" },
    { key: "2", name: "Lunch Menu", description: "Afternoon meals" },
  ]);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddMenu = (menu: { name: string; description: string }) => {
    setMenus((prev) => [...prev, { ...menu, key: String(prev.length + 1) }]);
    setIsAddModalVisible(false);
    message.success("Menu added successfully!");
  };

  const handleEditMenu = (menu: Menu) => {
    setMenus((prev) =>
      prev.map((item) => (item.key === menu.key ? menu : item))
    );
    setEditingMenu(null);
    message.success("Menu updated successfully!");
  };

  const handleDeleteMenu = (key: string) => {
    setMenus((prev) => prev.filter((menu) => menu.key !== key));
    message.success("Menu deleted successfully!");
  };

  return (
    <div className="menus-page">
      <Card
        title="Menus"
        extra={
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            Add Menu
          </Button>
        }
      >
        <MenuTable
          menus={menus}
          onEdit={(menu) => setEditingMenu(menu)}
          onDelete={handleDeleteMenu}
          onView={(key) => navigate(`/menu/${key}`)}
        />
      </Card>

      <AddModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSave={handleAddMenu}
      />

      {editingMenu && (
        <EditModal
          visible={!!editingMenu}
          item={editingMenu}
          onCancel={() => setEditingMenu(null)}
          onSave={handleEditMenu}
        />
      )}
    </div>
  );
};

export default MenusPage;
