import axios from "axios";
import { handleError } from "../utils/errorHandler"; // Assuming you have this hook for error handling
import { BASE_API_URL } from "../config/apiConfig"; // BASE_API_URL from your configuration

const API_URL = `${BASE_API_URL}/api/validation`;

export class ValidationService {
  private handleError: (error: unknown, retries?: number) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

  /**
   * Validates if the email is unique by sending a request to the backend.
   * @param emailCharacter The email string to validate.
   * @returns A promise with the validation result as a string.
   */
  async validateEmail(emailCharacter: string): Promise<string> {
    try {
      const response = await axios.post<string>(`${API_URL}/email`, null, {
        params: { emailCharacter },
      });
      return response.data; // "Email is unique." or error message
    } catch (error: any) {
      await this.handleError(error);
      throw error.response?.data || "Failed to validate email";
    }
  }

  /**
   * Validates if the restaurant name is unique by sending a request to the backend.
   * @param restaurantCharacter The restaurant name string to validate.
   * @returns A promise with the validation result as a string.
   */
  async validateRestaurant(
    restaurantCharacter: string
  ): Promise<string> {
    try {
      const response = await axios.post<string>(`${API_URL}/restaurant`, null, {
        params: { restaurantCharacter },
      });
      return response.data; // "Restaurant name is unique." or error message
    } catch (error: any) {
      await this.handleError(error);
      throw error.response?.data || "Failed to validate restaurant name";
    }
  }
}

export default new ValidationService();
