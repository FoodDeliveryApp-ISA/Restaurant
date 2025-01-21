import { useEffect, useRef } from "react";

const MAX_RETRIES = 5; // Maximum number of retry attempts
const RETRY_DELAY = 2000; // Delay between retries in milliseconds
const MAX_TIMEOUT = 30000; // Maximum timeout duration for retries in milliseconds

interface NotificationService {
  connectStompWebSocket: (restaurantId: string, callback: (notification: any) => void) => void;
  disconnectWebSocket: () => void;
}

declare const NotificationService: NotificationService;
declare const TokenUtil: { getRestaurantId: () => string | null };

const useWebSocketWithRetry = (handleNewNotification: (notification: any) => void): void => {
  useEffect(() => {
    const restaurantId = TokenUtil.getRestaurantId();
    let retryCount = 0;
    let isConnected = false;
    const startTime = Date.now(); // Start time for timeout tracking
    let retryTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      if (!restaurantId) {
        console.error("Restaurant ID not found in token");
        return;
      }

      try {
        NotificationService.connectStompWebSocket(String(restaurantId), handleNewNotification);
        isConnected = true;
        console.info("WebSocket connected successfully");
      } catch (error) {
        console.error("WebSocket connection failed:", error);
        retryConnection();
      }
    };

    const retryConnection = () => {
      if (isConnected) return; // Stop retrying if connected

      const elapsedTime = Date.now() - startTime;
      if (retryCount >= MAX_RETRIES || elapsedTime >= MAX_TIMEOUT) {
        console.error("Max retries or timeout reached. Unable to connect WebSocket.");
        return;
      }

      retryCount++;
      console.info(`Retrying connection... Attempt ${retryCount}`);
      retryTimeout = setTimeout(connectWebSocket, RETRY_DELAY);
    };

    connectWebSocket();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout); // Clear any pending retries
      }
      NotificationService.disconnectWebSocket();
      console.info("WebSocket disconnected");
    };
  }, [handleNewNotification]);
};

export default useWebSocketWithRetry;
