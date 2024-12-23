import axios, { AxiosResponse } from "axios";

// API URL for the backend
const API_URL = "http://localhost:8081/auth/";

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
  // Login method with type annotations
  login(
    restaurantEmail: string,
    restaurantPassword: string
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios
      .post<RestaurantResponse>(`${API_URL}signin`, {
        restaurantEmail,
        restaurantPassword,
      })
      .then((response: AxiosResponse<RestaurantResponse>) => {
        if (response.data.data.accessToken) {
          localStorage.setItem(
            "restaurant",
            JSON.stringify(response.data.data)
          );
          console.log(response.data)
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Login error:", error);
        throw error; // Propagate the error
      });
  }

  // Logout method
  logout(): void {
    localStorage.removeItem("restaurant");
  }

  // Register method with type annotations
  register(
    restaurantName: string,
    restaurantEmail: string,
    restaurantPassword: string,
    restaurantPhone: string,
    restaurantCity: string,
    restaurantLocation: string
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios
      .post<RestaurantResponse>(`${API_URL}signup`, {
        restaurantName,
        restaurantEmail,
        restaurantPassword,
        restaurantPhone,
        restaurantCity,
        restaurantLocation,
      })
      .then((response: AxiosResponse<RestaurantResponse>) => response.data)
      .catch((error) => {
        console.error("Registration error:", error);
        throw error; // Propagate the error
      });
  }

  // Create a new restaurant
  createRestaurant(
    data: Restaurant
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.post<RestaurantResponse>(`${API_URL}restaurants`, data);
  }

  // Update restaurant details
  updateRestaurant(
    restaurantId: string,
    data: Partial<Restaurant>
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.put<RestaurantResponse>(
      `${API_URL}restaurants/${restaurantId}`,
      data
    );
  }

  // Get a specific restaurant by ID
  getRestaurantById(
    restaurantId: string
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.get<RestaurantResponse>(
      `${API_URL}restaurants/${restaurantId}`
    );
  }

  // Get all restaurants
  getAllRestaurants(): Promise<AxiosResponse<RestaurantsResponse>> {
    return axios.get<RestaurantsResponse>(`${API_URL}restaurants`);
  }

  // Delete a restaurant by ID
  deleteRestaurant(
    restaurantId: string
  ): Promise<AxiosResponse<RestaurantResponse>> {
    return axios.delete<RestaurantResponse>(
      `${API_URL}restaurants/${restaurantId}`
    );
  }

  // Get current restaurant method with type annotations
  getCurrentRestaurant(): Restaurant | null {
    const restaurant = localStorage.getItem("restaurant");
    return restaurant ? (JSON.parse(restaurant) as Restaurant) : null;
  }
}

export default new AuthService();
