import axios, { AxiosResponse } from "axios";
import authHeader from "./auth-header"; // Adjust the path as necessary
import {
  RestaurantResponseDto,
  RequestUpdatedRestaurantDto,
} from "./dto/restaurant.dto";

// API URL for the backend
const API_URL = "http://localhost:8081/restaurants/";

class RestaurantService {
  // Get details of the authenticated restaurant
  async getAuthenticatedRestaurant(): Promise<RestaurantResponseDto | null> {
    try {
      const response: AxiosResponse<RestaurantResponseDto> = await axios.get(
        `${API_URL}auth`,
        { headers: authHeader() } // Include the auth header
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching authenticated restaurant details:", error);
      return null;
    }
  }

  // Update the authenticated restaurant
  async updateAuthenticatedRestaurant(
    restaurantDto: RequestUpdatedRestaurantDto
  ): Promise<RestaurantResponseDto | null> {
    try {
      const response: AxiosResponse<RestaurantResponseDto> = await axios.put(
        `${API_URL}auth`,
        restaurantDto,
        { headers: authHeader() } // Include the auth header
      );
      return response.data;
    } catch (error) {
      console.error("Error updating authenticated restaurant:", error);
      return null;
    }
  }

  // Delete the authenticated restaurant
  async deleteAuthenticatedRestaurant(): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}auth`, { headers: authHeader() }); // Include the auth header
      return true;
    } catch (error) {
      console.error("Error deleting authenticated restaurant:", error);
      return false;
    }
  }
}

export default new RestaurantService();
