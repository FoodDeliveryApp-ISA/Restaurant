import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../services/dto/error.dto"; // Adjust the path as per your project structure

// Centralized error handling
export const handleError = async (
  error: unknown, 
  retries: number = 3, 
  navigate?: Function
): Promise<void> => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorResponse: ErrorResponse = error.response?.data;

    // Log API error details
    console.error("API Error:", errorResponse || error.message);

    // Retry mechanism for network-related errors
    if (retries > 0 && (error.message.includes("Network Error") || !error.response)) {
      console.log(`Retrying request... Attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retry
      return handleError(error, retries - 1, navigate); // Recursive retry
    }

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        console.error("Bad Request - Invalid input.");
        break;

      case 401:
        console.error("Unauthorized - Redirecting to login.");
        if (navigate) navigate("/401"); // Call navigate if it's passed
        break;

      case 403:
        console.error("Forbidden - Access denied.");
        if (navigate) navigate("/403"); // Call navigate if it's passed
        break;

      case 404:
        console.error("Not Found - Resource not found.");
        if (navigate) navigate("/404"); // Call navigate if it's passed
        break;

      case 409:
        console.error(
          `Conflict - ${errorResponse?.message || "Resource already exists."}`
        );
        break;

      case 500:
        console.error("Server Error - Please try again later.");
        if (navigate) navigate("/500"); // Call navigate if it's passed
        break;

      default:
        console.error(
          `Unexpected Error: ${errorResponse?.message || error.message}`
        );
        break;
    }
  } else {
    console.error("Unknown error occurred:", error);
  }
};
