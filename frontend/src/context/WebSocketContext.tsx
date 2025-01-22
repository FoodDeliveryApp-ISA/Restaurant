import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import NotificationService from "../services/notification.service";
import TokenUtil from "../utils/tokenUtil";

interface WebSocketContextType {
  sendMessage: (message: any) => void;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);

  const sendMessage = useCallback((message: any) => {
    NotificationService.sendMessage(message);
  }, []);

  useEffect(() => {
    const restaurantId = TokenUtil.getRestaurantId();

    if (restaurantId) {
      NotificationService.connectStompWebSocket(String(restaurantId), () => {
        setConnected(true);
      });

      return () => {
        NotificationService.disconnectWebSocket();
        setConnected(false);
      };
    } else {
      console.error("Restaurant ID not found in token");
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendMessage, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
