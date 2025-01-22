import axios from "axios";
import authHeader from "./auth-header";
import {
  MenuDto,
  RequestMenuSaveDto,
  RequestUpdatedMenuDto,
} from "./dto/menu.dto";
import { handleError } from "../utils/errorHandler";
import { BASE_API_URL } from "../config/apiConfig";

const API_URL = `${BASE_API_URL}/api/menus`;

class MenuService {
  private handleError: (error: unknown) => Promise<void>;

  constructor() { // Initialize error handler
    this.handleError = handleError;
  }

  // Create a new menu
  async saveMenu(menuData: RequestMenuSaveDto): Promise<MenuDto> {
    try {
      console.log("Saving menu data:", menuData);
      const response = await axios.post<MenuDto>(API_URL, menuData, {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      console.log("Menu saved successfully:", response.data);
      return response.data;
    } catch (error) {
      await this.handleError(error); // Use centralized error handler
      throw error;
    }
  }

  // Get menu by ID
  async getMenuById(menuId: number): Promise<MenuDto> {
    try {
      const response = await axios.get<MenuDto>(`${API_URL}/${menuId}`, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  // Update an existing menu
  async updateMenu(
    menuId: number,
    menuData: Partial<RequestUpdatedMenuDto>
  ): Promise<MenuDto> {
    try {
      const currentMenuResponse = await axios.get<MenuDto>(
        `${API_URL}/${menuId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );

      const currentMenu = currentMenuResponse.data;

      const updatedMenuData = {
        ...currentMenu,
        ...menuData,
      };

      const response = await axios.put<MenuDto>(
        `${API_URL}/${menuId}`,
        updatedMenuData,
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );

      console.log("Response from updateMenu API:", response.data);
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  // Get all menus for the authenticated restaurant
  async getAllMenus(): Promise<MenuDto[]> {
    try {
      const response = await axios.get<MenuDto[]>(API_URL, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  // Delete a menu
  async deleteMenu(menuId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${menuId}`, {
        headers: authHeader(),
      });
      console.log(`Menu with ID ${menuId} deleted successfully.`);
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }
}

export default new MenuService();
