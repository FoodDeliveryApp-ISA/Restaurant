import axios, { AxiosResponse } from "axios";
import ToastNotification from "../components/ToastNotification"; // Adjust the path if necessary
import TokenUtil from "../utils/tokenUtil";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  Restaurant,
} from "./dto/auth.dto";

const API_URL = "http://localhost:8081/auth/";

class AuthService {
  // Login method
  login(data: LoginRequest): Promise<LoginResponse> {
    return axios
      .post<LoginResponse>(`${API_URL}login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // For cookies or session management
      })
      .then((response: AxiosResponse<LoginResponse>) => {
        const { token } = response.data;
        if (token) {
          TokenUtil.storeToken(token); // Store the token using TokenUtil
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

  // Register method
  // Register method with auto-login after successful registration
  register(data: RegisterRequest): Promise<LoginResponse> {
    return axios
      .post<Restaurant>(`${API_URL}signup`, data)
      .then((response: AxiosResponse<Restaurant>) => {
        ToastNotification.success({
          message: "Registration Successful",
          description: "Welcome! Your account has been created.",
        });

        // Assuming the response contains the restaurantId
        if (response.data.restaurantId) {
          // Store the restaurantId in localStorage
          localStorage.setItem(
            "restaurantId",
            response.data.restaurantId.toString()
          );
        } else {
          console.warn("Response does not contain restaurantId.");
        }

        // Automatically log the user in after registration
        const loginData: LoginRequest = {
          email: data.restaurantEmail,
          password: data.restaurantPassword,
        };

        // Trigger login after successful registration
        return this.login(loginData);
      })
      .catch((error) => {
        ToastNotification.error({
          message: "Registration Failed",
          description:
            error.response?.data?.message ||
            "An error occurred during registration.",
        });

        console.error(
          "Registration error:",
          error.response?.data || error.message
        );
        throw error;
      });
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return TokenUtil.getToken() !== null; // Check if the token exists
  }

  // Logout method
  logout(): void {
    TokenUtil.removeToken();
    ToastNotification.info({
      message: "Logged Out",
      description: "You have successfully logged out.",
    });
  }
}

export default new AuthService();
