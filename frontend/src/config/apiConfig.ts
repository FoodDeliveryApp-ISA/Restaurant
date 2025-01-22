const API_URLS = {
  development: "http://localhost:8081",
  production: "https://10.20.11.29:8081",
};

// Default to 'development' if NODE_ENV is undefined
const environment = process.env.NODE_ENV || "development";

// Base API URL for REST APIs
export const BASE_API_URL = API_URLS[environment] || API_URLS.development;

// WebSocket URLs based on environment
const WS_URLS = {
  development: "http://localhost:8081/ws",
  production: "https://10.20.11.29:8081/ws",
};

// Base WebSocket URL
export const BASE_WS_URL = WS_URLS[environment] || WS_URLS.development;
