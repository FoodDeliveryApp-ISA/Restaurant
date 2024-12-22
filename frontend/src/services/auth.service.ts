import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8081/auth/";

interface Restaurant {
  restaurantEmail: string;
  restaurantPassword: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  enabled?: boolean;
  accessToken?: string; // Ensure accessToken is part of the response if needed
}

interface LoginRequest {
  email: string;
  password: string;
}

class AuthService {
  // Login method with type annotations
  login(data: LoginRequest): Promise<Restaurant> {
    return axios
      .post<Restaurant>(`${API_URL}login`, data, {
        headers: {
          "Content-Type": "application/json",
          // Add any necessary headers here, e.g., Authorization: `Bearer ${yourToken}`
        },
      })
      .then((response: AxiosResponse<Restaurant>) => {
        if (response.data.token) {
          // You may want to store only the token or other relevant fields
          localStorage.setItem("restaurant", JSON.stringify(response.data));
        }
        console.log("Login response:", response.data); // Check the response object
        console.log(
          "Stored restaurant data:",
          localStorage.getItem("restaurant")
        );
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
  register(data: Restaurant): Promise<AxiosResponse<Restaurant>> {
    return axios
      .post<Restaurant>(API_URL + "signup", data)
      .then((response: AxiosResponse<Restaurant>) => response.data)
      .catch((error) => {
        console.error("Registration error:", error);
        throw error;
      });
  }

  // Get current restaurant method with type annotations
  getCurrentRestaurant(): Restaurant | null {
    const restaurant = localStorage.getItem("restaurant");
    return restaurant ? (JSON.parse(restaurant) as Restaurant) : null;
  }
}

export default new AuthService();
