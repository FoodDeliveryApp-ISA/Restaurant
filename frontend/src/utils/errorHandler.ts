import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../services/dto/error.dto"; // Adjust the import according to your project structure
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import React from "react";

// Create a custom hook to handle errors
export const useErrorHandler = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleError = async (
    error: unknown,
    retries: number = 3
  ): Promise<void> => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorResponse: ErrorResponse = error.response?.data;

      // Log API error
      console.error("API Error:", errorResponse || error.message);

      // Retry mechanism for network-related errors
      if (
        retries > 0 &&
        (error.message.includes("Network Error") || !error.response)
      ) {
        console.log(`Retrying request... Attempts left: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return handleError(error, retries - 1); // Recursive retry
      }

      // Handle different status codes or special cases
      switch (status) {
        case 400:
          console.error("Bad Request - Invalid input.");
          break;
        case 401:
          console.error("Unauthorized - Redirecting to login.");
          navigate("/401"); // Redirect to Unauthorized page
          break;
        case 403:
          console.error("Forbidden - Access denied.");
          navigate("/403"); // Redirect to Forbidden page
          break;
        case 404:
          console.error("Not Found - Resource not found.");
          navigate("/404"); // Redirect to Not Found page
          break;
        case 409:
          console.error(
            `Conflict - ${errorResponse?.message || "Resource already exists."}`
          );
          break;
        case 500:
          console.error("Server Error - Please try again later.");
          navigate("/500"); // Redirect to Server Error page
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

  return { handleError }; // Return the handleError function
};
