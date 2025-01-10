const API_URLS = {
  development: "http://localhost:8081",
  production: "https://10.20.11.29:8081",
};

// Default to 'development' if NODE_ENV is undefined
const environment = process.env.NODE_ENV || "development";

// Export the base API URL dynamically based on the environment
export const BASE_API_URL = API_URLS[environment] || API_URLS.development;
