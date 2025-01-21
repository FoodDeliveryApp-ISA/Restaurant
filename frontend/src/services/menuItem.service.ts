// src/services/menuitem.service.ts

import axios from "axios";
import authHeader from "./auth-header";
import {
  MenuItemDto,
  RequestMenuItemSaveDto,
  RequestUpdatedMenuItemDto,
} from "./dto/menuItem.dto";
import { handleError } from "../utils/errorHandler";
import { BASE_API_URL } from "../config/apiConfig";

const API_URL = `${BASE_API_URL}/api/menu`;

class MenuItemService {
  private handleError: (error: unknown, retries?: number) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

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
      await this.handleError(error);
      throw error;
    }
  }

  // Get a menu item by ID
  async getMenuItemDetails(
    menuId: number,
    menuItemId: number
  ): Promise<MenuItemDto> {
    try {
      console.log(`Fetching details for menu item ID: ${menuItemId}`);
      const response = await axios.get<MenuItemDto>(
        `${API_URL}/${menuId}/menuitems/${menuItemId}`,
        {
          headers: authHeader(),
        }
      );
      console.log("Menu Item Details:", response.data);
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  // Get all menu items
  async getAllMenuItems(menuId: number): Promise<MenuItemDto[]> {
    try {
      console.log("Getting all menu items for menu ID: " + menuId);

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
      await this.handleError(error);
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
      console.log(updatedMenuItemData); // Replace 'data' with your actual object name
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
      console.log(response);
      console.log(response.data);
      return response.data;
    } catch (error) {
      await this.handleError(error);
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
      await this.handleError(error);
      throw error;
    }
  }
}

export default new MenuItemService();
