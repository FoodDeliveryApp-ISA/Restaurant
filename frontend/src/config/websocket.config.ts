// STOMP client configuration
export const STOMP_CONFIG = {
    debug: (str: string) => console.log("STOMP Debug:", str),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  };
  
  // WebSocket URLs based on environment
  const WS_URLS = {
    development: "http://localhost:8081/ws",
    production: "https://10.20.11.29:8081/ws",
  };
  
  // Current environment
  const environment = process.env.NODE_ENV || "development";
  
  // Base WebSocket URL
  export const BASE_WS_URL = WS_URLS[environment] || WS_URLS.development;
  
  // Utility function to construct WebSocket URLs with optional query parameters
  export const getWebSocketUrl = (endpoint: string, params?: Record<string, string>): string => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return `${BASE_WS_URL}/${endpoint}${queryString}`;
  };
  