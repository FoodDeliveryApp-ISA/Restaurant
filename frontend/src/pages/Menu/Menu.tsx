import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import MenuService from "../../services/menu.service"; // Adjust the path as necessary
import {
  MenuDto,
  RequestMenuSaveDto,
  RequestUpdatedMenuDto,
} from "../../services/dto/menu.dto"; // Adjust the path as necessary
import MenuTable from "./components/MenuTable";

const MenusPage: React.FC = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [editingMenu, setEditingMenu] = useState<MenuDto | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Fetch menus from the API when the component mounts
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const fetchedMenus = await MenuService.getAllMenus();
        setMenus(Array.isArray(fetchedMenus) ? fetchedMenus : []); // Ensure menus is always an array
      } catch (error) {
        message.error("Failed to fetch menus!");
        console.error(error);
      }
    };

    fetchMenus();
  }, []);

  const handleAddMenu = async (menu: RequestMenuSaveDto) => {
    try {
      const newMenu = await MenuService.saveMenu(menu);
      setMenus((prev) => [newMenu, ...prev]);
      setIsAddModalVisible(false);
      message.success("Menu added successfully!");
    } catch (error) {
      message.error("Failed to add menu!");
      console.error(error);
    }
  };

  const handleEditMenu = async (menu: MenuDto) => {
    try {
      const updatedMenu = await MenuService.updateMenu(menu.menuId, {
        menuName: menu.menuName,
        menuDescription: menu.menuDescription,
        active: menu.active,
      } as RequestUpdatedMenuDto);
      setMenus((prev) =>
        prev.map((item) =>
          item.menuId === updatedMenu.menuId ? updatedMenu : item
        )
      );
      setEditingMenu(null);
      message.success("Menu updated successfully!");
    } catch (error) {
      message.error("Failed to update menu!");
      console.error(error);
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      await MenuService.deleteMenu(menuId);
      setMenus((prev) => prev.filter((menu) => menu.menuId !== menuId));
      message.success("Menu deleted successfully!");
    } catch (error) {
      message.error("Failed to delete menu!");
      console.error(error);
    }
  };

  const handleToggleActive = async (menuId: number, isActive: boolean) => {
    try {
      const updatedMenu = await MenuService.updateMenu(menuId, { active: isActive });
      setMenus((prev) =>
        prev.map((item) => (item.menuId === menuId ? updatedMenu : item))
      );
      message.success("Menu status updated successfully!");
    } catch (error) {
      message.error("Failed to update menu status!");
      console.error(error);
    }
  };

  return (
    <div className="container">
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
          onEdit={setEditingMenu}
          onDelete={handleDeleteMenu}
          onView={(menuId) => navigate(`/menu/${menuId}`)}
          onToggleActive={handleToggleActive}
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
