import axios from "axios";

const BASE_URL = "http://localhost:8081/api/validation";

export class ValidationService {
  /**
   * Validates if the email is unique by sending a request to the backend.
   * @param emailCharacter The email string to validate.
   * @returns A promise with the validation result as a string.
   */
  static async validateEmail(emailCharacter: string): Promise<string> {
    try {
      const response = await axios.post(`${BASE_URL}/email`, null, {
        params: { emailCharacter },
      });
      return response.data; // "Email is unique." or error message
    } catch (error: any) {
      throw error.response?.data || "Failed to validate email";
    }
  }

  /**
   * Validates if the restaurant name is unique by sending a request to the backend.
   * @param restaurantCharacter The restaurant name string to validate.
   * @returns A promise with the validation result as a string.
   */
  static async validateRestaurant(
    restaurantCharacter: string
  ): Promise<string> {
    try {
      const response = await axios.post(`${BASE_URL}/restaurant`, null, {
        params: { restaurantCharacter },
      });
      return response.data; // "Restaurant name is unique." or error message
    } catch (error: any) {
      throw error.response?.data || "Failed to validate restaurant name";
    }
  }
}

export default new ValidationService();
