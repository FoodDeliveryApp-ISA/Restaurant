import axios, { AxiosResponse } from "axios";
import authHeader from "./auth-header"; // Adjust the path as necessary
import ToastNotification from "../components/ToastNotification";
import { BASE_API_URL } from "../config/apiConfig";
import { ForgetPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./dto/password.dto";
import { handleError } from "../utils/errorHandler"; // Assuming this hook is available for error handling

const API_URL = `${BASE_API_URL}/password-reset/`; // Base API URL for password reset
const RESTAURANT_API_URL = `${BASE_API_URL}/restaurants/`; // Base API URL for restaurant-related actions

class PasswordService {
  private handleError: (error: unknown, retries?: number) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

  /**
   * Requests a password reset by sending an email.
   * @param data - ForgetPasswordDto containing the email address.
   * @returns Promise resolving to a success message.
   */
  async requestPasswordReset(data: ForgetPasswordDto): Promise<string> {
    try {
      const response: AxiosResponse<string> = await axios.post(
        `${API_URL}request`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      ToastNotification.success({
        message: "Password Reset Requested",
        description: "Please check your email for reset instructions.",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during the password reset request.";
      ToastNotification.error({
        message: "Password Reset Request Failed",
        description: errorMessage,
      });
      await this.handleError(error);
      throw error;
    }
  }

  /**
   * Validates the reset token provided by the user.
   * @param token - The reset token to validate.
   * @returns Promise resolving to a success message.
   */
  async validateResetToken(token: string): Promise<string> {
    try {
      const response: AxiosResponse<string> = await axios.get(
        `${API_URL}validate`,
        { params: { token } }
      );
      ToastNotification.success({
        message: "Token Validated",
        description: "The reset token is valid.",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "The token is invalid or has expired.";
      ToastNotification.error({
        message: "Token Validation Failed",
        description: errorMessage,
      });
      await this.handleError(error);
      throw error;
    }
  }

  /**
   * Resets the password using the provided token and new password.
   * @param data - ResetPasswordDto containing the reset token and new password.
   * @returns Promise resolving to a success message.
   */
  async resetPassword(data: ResetPasswordDto): Promise<string> {
    try {
      const response: AxiosResponse<string> = await axios.post(
        `${API_URL}reset`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      ToastNotification.success({
        message: "Password Reset Successful",
        description: "Your password has been updated successfully.",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while resetting the password.";
      ToastNotification.error({
        message: "Password Reset Failed",
        description: errorMessage,
      });
      await this.handleError(error);
      throw error;
    }
  }

  /**
   * Changes the password of an authenticated user.
   * @param data - ChangePasswordDto containing email, old password, and new password.
   * @returns Promise resolving to a success message.
   */
  async changePassword(data: ChangePasswordDto): Promise<string> {
    try {
      const response: AxiosResponse<string> = await axios.post(
        `${RESTAURANT_API_URL}change-password`,
        data,
        { 
          headers: { 
            "Content-Type": "application/json",
            ...authHeader(), // Include the auth header
          },
        }
      );
      ToastNotification.success({
        message: "Password Changed Successfully",
        description: "Your password has been updated successfully.",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while changing the password.";
      ToastNotification.error({
        message: "Password Change Failed",
        description: errorMessage,
      });
      await this.handleError(error);
      throw error;
    }
  }
}

export default new PasswordService();
