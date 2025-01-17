import axios, { AxiosResponse } from "axios";
import authHeader from "./auth-header"; // Adjust the path as necessary
import {
  RestaurantResponseDto,
  RequestUpdatedRestaurantDto,
} from "./dto/restaurant.dto";
import { BASE_API_URL } from "../config/apiConfig"; // Import API URL from config
import { handleError } from "../utils/errorHandler"; // Assuming you have a custom error handler

const API_URL = `${BASE_API_URL}/restaurants/`;

class RestaurantService {
  private handleError: (error: unknown) => void;

  constructor() {
    this.handleError = handleError;
  }

  // Get details of the authenticated restaurant
  async getAuthenticatedRestaurant(): Promise<RestaurantResponseDto | null> {
    try {
      const response: AxiosResponse<RestaurantResponseDto> = await axios.get(
        `${API_URL}auth`,
        { headers: authHeader() } // Include the auth header
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      console.error("Error fetching authenticated restaurant details:", error);
      return null;
    }
  }

  async updateRestaurantEmail(
    newEmail: string
  ): Promise<RestaurantResponseDto | null> {
    try {
      const dto: RequestUpdatedRestaurantDto = { restaurantEmail: newEmail };
      return await this.updateAuthenticatedRestaurant(dto);
    } catch (error) {
      console.error("Error updating email:", error);
      return null;
    }
  }
  async updateRestaurantLocation(
    newLocation: string
  ): Promise<RestaurantResponseDto | null> {
    try {
      const dto: RequestUpdatedRestaurantDto = {
        restaurantLocation: newLocation,
      }; // Assuming `restaurantLocation` is the field for location
      return await this.updateAuthenticatedRestaurant(dto);
    } catch (error) {
      console.error("Error updating restaurant location:", error);
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
      this.handleError(error);
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
      this.handleError(error);
      console.error("Error deleting authenticated restaurant:", error);
      return false;
    }
  }
}

export default new RestaurantService();
