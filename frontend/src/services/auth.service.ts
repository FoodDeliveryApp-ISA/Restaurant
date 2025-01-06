import axios, { AxiosResponse } from "axios";
import ToastNotification from "../components/ToastNotification";
import { jwtDecode } from "jwt-decode";
import TokenUtil from "../utils/tokenUtil";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  Restaurant,
} from "./dto/auth.dto";

const API_URL = "http://localhost:8081/auth/";

class AuthService {
  /**
   * Logs in a user with provided credentials.
   * @param data - Login request containing email and password.
   * @returns Promise resolving to LoginResponse.
   */
  login(data: LoginRequest): Promise<LoginResponse> {
    return axios
      .post<LoginResponse>(`${API_URL}login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response: AxiosResponse<LoginResponse>) => {
        const { token } = response.data;
        if (token) {
          TokenUtil.storeToken(token);
          ToastNotification.success({
            message: "Login Successful",
            description: "Welcome back!",
          });
        }
        return response.data;
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred during login.";
        ToastNotification.error({
          message: "Login Failed",
          description: errorMessage,
        });
        throw error;
      });
  }

  /**
   * Registers a new user and logs them in automatically after registration.
   * @param data - Registration request containing user details.
   * @returns Promise resolving to LoginResponse.
   */
  register(data: RegisterRequest): Promise<LoginResponse> {
    return axios
      .post<Restaurant>(`${API_URL}signup`, data)
      .then((response: AxiosResponse<Restaurant>) => {
        ToastNotification.success({
          message: "Registration Successful",
          description: "Welcome! Your account has been created.",
        });

        // Auto-login using registration credentials
        const loginData: LoginRequest = {
          email: data.restaurantEmail,
          password: data.restaurantPassword,
        };
        return this.login(loginData);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during registration.";
        ToastNotification.error({
          message: "Registration Failed",
          description: errorMessage,
        });
        console.error(
          "Registration error:",
          error.response?.data || error.message
        );
        throw error;
      });
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
   * Logs out the user by clearing the token and notifying them.
   */
  logout(): void {
    TokenUtil.removeToken();
    ToastNotification.info({
      message: "Logged Out",
      description: "You have successfully logged out.",
    });
  }
}

export default new AuthService();
