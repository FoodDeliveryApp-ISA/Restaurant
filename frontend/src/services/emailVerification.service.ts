import axios, { AxiosResponse } from "axios";
import ToastNotification from "../components/ToastNotification"; // Adjust path as needed
import { RequestVerificationDto, VerifyEmailDto } from "./dto/emailVerification.dto";
import { handleError} from "../utils/errorHandler"; // Assuming you have this hook for error handling
import { BASE_API_URL } from "../config/apiConfig"; // BASE_API_URL from your configuration

const API_URL = `${BASE_API_URL}/email/`; // Update based on backend URL from apiConfig

class EmailVerificationService {
  private handleError: (error: unknown, retries?: number) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

  // Request a verification code
  async requestVerificationCode(data: RequestVerificationDto): Promise<void> {
    try {
      await axios.post(`${API_URL}request`, data);
      console.log(data);
      ToastNotification.success({
        message: "Verification Code Sent",
        description: "Please check your email for the verification code.",
      });
    } catch (error: any) {
      console.log(data);
      ToastNotification.error({
        message: "Request Failed",
        description: error.response?.data || "Unable to send the verification code.",
      });
      await this.handleError(error);
      throw error;
    }
  }

  // Verify the user with the code
  async verifyUser(data: VerifyEmailDto): Promise<void> {
    try {
      await axios.post(`${API_URL}verify`, data);
      ToastNotification.success({
        message: "Account Verified",
        description: "Your account has been successfully verified.",
      });
    } catch (error: any) {
      ToastNotification.error({
        message: "Verification Failed",
        description: error.response?.data || "The verification code is invalid or expired.",
      });
      await this.handleError(error);
      throw error;
    }
  }

  // Resend the verification code
  async resendVerificationCode(data: RequestVerificationDto): Promise<void> {
    try {
      await axios.post(`${API_URL}resend`, data);
      ToastNotification.success({
        message: "Verification Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      ToastNotification.error({
        message: "Resend Failed",
        description: error.response?.data || "Unable to resend the verification code.",
      });
      await this.handleError(error);
      throw error;
    }
  }
}

export default new EmailVerificationService();
