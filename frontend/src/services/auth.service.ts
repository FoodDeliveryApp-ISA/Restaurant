import axios, { AxiosResponse } from "axios";
import ToastNotification from "../components/ToastNotification"; // Adjust the path as needed

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
        },
        withCredentials: true, // Send credentials with the request
      })
      .then((response: AxiosResponse<Restaurant>) => {
        console.log("API Response Data2:", response.data);
        if (response.data.token) {
          console.log("Access Token found:", response.data.accessToken);
          localStorage.setItem("restauran","assa");
          localStorage.setItem("restaurant", JSON.stringify(response.data.accessToken));
          console.log("Access Token found3:", response.data.accessToken);
          ToastNotification.success({
            message: "Login Successful",
            description: "Welcome back!",
          });
        }
        return response.data;
      })
      .catch((error) => {
        ToastNotification.error({
          message: "Login Failed",
          description:
            error.response?.data?.message || "An error occurred during login.",
        });
        throw error;
      });
  }
  
  isAuthenticated(): boolean {
    const restaurantData = localStorage.getItem("restaurant");
    return !!restaurantData; // Returns true if data exists, otherwise false
  }

  logout(): void {
    localStorage.removeItem("restaurant");
    ToastNotification.info({
      message: "Logged Out",
      description: "You have successfully logged out.",
    });
  }

  register(data: Restaurant): Promise<AxiosResponse<Restaurant>> {
    return axios
      .post<Restaurant>(`${API_URL}signup`, data)
      .then((response: AxiosResponse<Restaurant>) => {
        ToastNotification.success({
          message: "Registration Successful",
          description: "Welcome! Your account has been created.",
        });
        return response.data;
      })
      .catch((error) => {
        ToastNotification.error({
          message: "Registration Failed",
          description:
            error.response?.data?.message ||
            "An error occurred during registration.",
        });
        throw error;
      });
  }

  getCurrentRestaurant(): Restaurant | null {
    const restaurant = localStorage.getItem("restaurant");
    return restaurant ? (JSON.parse(restaurant) as Restaurant) : null;
  }
}

export default new AuthService();
