import axios, { AxiosResponse } from "axios";
import ToastNotification from "../components/ToastNotification";
import { jwtDecode } from "jwt-decode";
import TokenUtil from "../utils/tokenUtil";
import { RegisterRequest, LoginRequest, LoginResponse, Restaurant } from "./dto/auth.dto";
import { handleError } from "../utils/errorHandler"; // Assuming this hook is available for error handling
import { BASE_API_URL } from "../config/apiConfig"; // BASE_API_URL from your configuration

const API_URL = `${BASE_API_URL}/auth/`; // Base API URL from the configuration

class AuthService {
  private handleError: (error: unknown, retries?: number) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

  /**
   * Logs in a user with provided credentials.
   * @param data - Login request containing email and password.
   * @returns Promise resolving to LoginResponse.
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${API_URL}login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { token } = response.data;
      if (token) {
        TokenUtil.storeToken(token);
        // ToastNotification.success({
        //   message: "Login Successful",
        //   description: "Welcome back!",
        // });
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      ToastNotification.error({
        message: "Login Failed",
        description: errorMessage,
      });
      await this.handleError(error);
      throw error;
    }
  }

  /**
   * Registers a new user and logs them in automatically after registration.
   * @param data - Registration request containing user details.
   * @returns Promise resolving to LoginResponse.
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    console.log("try register");
    try {
      const response: AxiosResponse<Restaurant> = await axios.post(
        `${API_URL}signup`,
        data
      );
      // ToastNotification.success({
      //   message: "Registration Successful",
      //   description: "Welcome! Your account has been created.",
      // });

      // Auto-login using registration credentials
      const loginData: LoginRequest = {
        email: data.restaurantEmail,
        password: data.restaurantPassword,
      };
      return this.login(loginData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during registration.";
      ToastNotification.error({
        message: "Registration Failed",
        description: errorMessage,
      });
      console.error("Registration error:", error.response?.data || error.message);
      await this.handleError(error);
      throw error;
    }
  }

  /**
   * Checks if the user is authenticated by verifying the stored token.
   * @returns True if the token exists and is valid, otherwise false.
   */
  isAuthenticated(): boolean {
    const token = TokenUtil.getToken();
    if (!token) return false;

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime; // Token is valid if not expired
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  }

 /**
 * Logs out the user by clearing the token, notifying them,
 * and triggering server-side cache clearing.
 */
async logout(): Promise<void> {
  try {
    // Call the cache clear endpoint
    const response = await axios.post(`${BASE_API_URL}/cache/clear`, null, {
      withCredentials: true,
    });

    if (response.status === 204) {
      console.info("Cache cleared successfully.");
      ToastNotification.info({
        message: "Logged Out",
        description: "You have successfully logged out and caches have been cleared.",
      });
    } else {
      console.warn("Cache clear endpoint responded with unexpected status:", response.status);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error clearing server caches.";
    console.error("Error clearing server caches:", errorMessage);
    ToastNotification.warning({
      message: "Logged Out (Partial)",
      description: "Logged out successfully, but cache clearing failed.",
    });
  } finally {
    // Always remove the token
    TokenUtil.removeToken();
  }
}

}

export default new AuthService();
