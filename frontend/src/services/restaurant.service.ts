import axios, { AxiosResponse } from "axios";

// API URL for the backend
const API_URL = "http://localhost:8081/restaurants/";

// Interfaces for the Restaurant and Response data
interface Restaurant {
  restaurantName: string;
  restaurantEmail: string;
  restaurantPassword: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  enabled: boolean;
  accessToken?: string;
}

interface RestaurantResponse {
  message: string;
  status: string;
  data: Restaurant;
}

interface RestaurantsResponse {
  message: string;
  status: string;
  data: Restaurant[];
}

class AuthService {

  // Update restaurant details
  updateRestaurant(
    restaurantId: string,
    data: Partial<Restaurant>
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.put<RestaurantResponse>(
      `${API_URL}${restaurantId}`,
      data
    );
  }

  // Get a specific restaurant by ID
  getRestaurantById(
    restaurantId: string
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.get<RestaurantResponse>(
      `${API_URL}${restaurantId}`
    );
  }

  // Get all restaurants
  getAllRestaurants(): Promise<AxiosResponse<RestaurantsResponse>> {
    return axios.get<RestaurantsResponse>(`${API_URL}`);
  }

  // Delete a restaurant by ID
  deleteRestaurant(
    restaurantId: string
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.delete<RestaurantResponse>(
      `${API_URL}${restaurantId}`
    );
  }

  // Get current restaurant method with type annotations
  getCurrentRestaurant(): Restaurant | null {
    const restaurant = localStorage.getItem("restaurant");
    return restaurant ? (JSON.parse(restaurant) as Restaurant) : null;
  }
}

export default new AuthService();
