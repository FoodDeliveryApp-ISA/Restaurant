import axios from "axios";
import { handleError } from "../utils/errorHandler"; // Assuming you have this hook for error handling
import { BASE_API_URL } from "../config/apiConfig"; // BASE_API_URL from your configuration

const API_URL = `${BASE_API_URL}/api/rider-request`;

export interface Order {
  orderId: string;
  restaurantLocation: [number, number];
  customerLocation: [number, number];
  customerName: string;
  customerAddress: string;
  customerPhone: string;
}

export class RiderRequestService {
  private handleError: (error: unknown, retries?: number) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

  /**
   * Sends a rider request to the backend using the provided order details.
   * @param order The order object containing all necessary details.
   * @returns A promise with the success message or an error message.
   */
  async sendRiderRequest(order: Order): Promise<string> {
    try {
        console.log(order);
      const response = await axios.post<string>(API_URL, order);
      console.log(order);
      return response.data; // "Rider request sent successfully for orderId: ..."
    } catch (error: any) {
      await this.handleError(error);
      throw error.response?.data || "Failed to send rider request";
    }
  }
}

export default new RiderRequestService();
