import axios from "axios";
import authHeader from "./auth-header";
import {
  MenuDto,
  RequestMenuSaveDto,
  RequestUpdatedMenuDto,
} from "./dto/menu.dto";

const API_URL = "http://localhost:8081/api/menus";

class MenuService {
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
      this.handleError(error);
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
      this.handleError(error);
      throw error;
    }
  }

  // Update an existing menu
  async updateMenu(
    menuId: number,
    menuData: Partial<RequestUpdatedMenuDto>
  ): Promise<MenuDto> {
    try {
      // Fetch the current menu details to preserve other required fields (like menuName)
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

      // Combine current menu data with the new data to ensure required fields like 'menuName' are included
      const updatedMenuData = {
        ...currentMenu,
        ...menuData, // Merge the updated fields, like 'active'
      };

      // Send the update request with the merged data
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

      // Log the response to confirm that the menu was updated correctly
      console.log("Response from updateMenu API:", response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
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

export default new MenuService();
