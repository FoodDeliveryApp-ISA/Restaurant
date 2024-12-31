import axios, { AxiosResponse } from "axios";
import ToastNotification from "../components/ToastNotification"; // Adjust path as needed
import { RequestVerificationDto , VerifyEmailDto } from "./dto/emailVerification.dto";

const API_URL = "http://localhost:8081/email/"; // Update based on backend URL

class EmailVerificationService {

  // Request a verification code
  requestVerificationCode(data: RequestVerificationDto): Promise<void> {
    return axios
      .post(`${API_URL}request`, data)
      .then(() => {
        console.log(data);
        ToastNotification.success({
          message: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
      })
      .catch((error) => {
        console.log(data);
        ToastNotification.error({
          message: "Request Failed",
          description:
            error.response?.data || "Unable to send the verification code.",
        });
        throw error;
      });
  }

  // Verify the user with the code
  verifyUser(data: VerifyEmailDto): Promise<void> {
    return axios
      .post(`${API_URL}verify`, data)
      .then(() => {
        ToastNotification.success({
          message: "Account Verified",
          description: "Your account has been successfully verified.",
        });
      })
      .catch((error) => {
        ToastNotification.error({
          message: "Verification Failed",
          description:
            error.response?.data || "The verification code is invalid or expired.",
        });
        throw error;
      });
  }

  // Resend the verification code
  resendVerificationCode(data: RequestVerificationDto): Promise<void> {
    return axios
      .post(`${API_URL}resend`, data)
      .then(() => {
        ToastNotification.success({
          message: "Verification Code Resent",
          description: "A new verification code has been sent to your email.",
        });
      })
      .catch((error) => {
        ToastNotification.error({
          message: "Resend Failed",
          description:
            error.response?.data || "Unable to resend the verification code.",
        });
        throw error;
      });
  }
}

export default new EmailVerificationService();
