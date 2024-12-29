// src/services/MenuItemService.ts
import axios from "axios";
import authHeader from "./auth-header";
import {
  MenuItemDto,
  RequestMenuItemSaveDto,
  RequestUpdatedMenuItemDto,
} from "./dto/menuItem.dto";

const API_URL = "http://localhost:8081/api/menu";

class MenuItemService {
  // Create a new menu item
  async createMenuItem(
    menuId: number,
    menuItemData: RequestMenuItemSaveDto
  ): Promise<MenuItemDto> {
    try {
      console.log("Creating menu item: " + menuId);
      console.log(JSON.stringify(menuItemData));
      const response = await axios.post<MenuItemDto>(
        `${API_URL}/${menuId}/menuitems`,
        menuItemData,
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      console.log(response);
      console.log(response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get a menu item by ID
  async getMenuItemById(
    menuId: number,
    menuItemId: number
  ): Promise<MenuItemDto> {
    try {
      const response = await axios.get<MenuItemDto>(
        `${API_URL}/${menuId}/menuitems/${menuItemId}`,
        {
          headers: authHeader(),
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get all menu items
  async getAllMenuItems(menuId: number): Promise<MenuItemDto[]> {
    try {
      console.log("Getting all menu items for menu ID: " + menuId);

      // Uncomment the following line to simulate a delay in the API
      const response = await axios.get<MenuItemDto[]>(
        `${API_URL}/${menuId}/menuitems`,
        {
          headers: authHeader(),
        }
      );
      console.log("Response: " + response);
      console.log("Menu items: " + response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update a menu item
  async updateMenuItem(
    menuId: number,
    menuItemId: number,
    updatedMenuItemData: RequestUpdatedMenuItemDto
  ): Promise<MenuItemDto> {
    try {
      const response = await axios.put<MenuItemDto>(
        `${API_URL}/${menuId}/menuitems/${menuItemId}`,
        updatedMenuItemData,
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete a menu item
  async deleteMenuItem(menuId: number, menuItemId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${menuId}/menuitems/${menuItemId}`, {
        headers: authHeader(),
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Centralized error handling
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login");
        // Optionally, add redirect or logout logic here
      }
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}

export default new MenuItemService();
