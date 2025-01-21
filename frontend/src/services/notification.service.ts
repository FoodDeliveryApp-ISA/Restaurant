import { Client, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { EventEmitter } from "events";
import authHeader from "./auth-header";
import { BASE_API_URL } from "../config/apiConfig";
import { handleError } from "../utils/errorHandler";

const API_URL = `${BASE_API_URL}/api/notifications`;

class NotificationService {
  private stompClient: Client | null = null;
  private rawSocket: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  private retryAttempts = 0;
  private maxRetryAttempts = 5;
  private retryDelay = 5000;

  // Connect to STOMP WebSocket
  connectStompWebSocket(userId: string, onMessage: (message: string) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      console.warn("STOMP WebSocket is already connected.");
      return;
    }

    const socketUrl = `${BASE_API_URL}/ws/notification-stomp?userId=${userId}`;
    const socket = new SockJS(socketUrl);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 0, // Disable built-in reconnect delay to handle it manually
    });

    this.stompClient.onConnect = () => {
      console.log("STOMP WebSocket connected successfully!");
      this.retryAttempts = 0; // Reset retry attempts on successful connection
      this.stompClient?.subscribe(`/topic/notifications/${userId}`, (message: Message) => {
        console.log("Message received on topic:", message.body); // Log the received message
        onMessage(message.body);
      });
    };

    this.stompClient.onStompError = (error) => {
      console.error("STOMP WebSocket error:", error);
      this.retryConnection(userId, onMessage); // Retry connection on error
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn("STOMP WebSocket closed.");
      this.retryConnection(userId, onMessage); // Retry connection on close
    };

    this.stompClient.onStompError = (error) => {
      console.error("STOMP Error:", error);
    };

    this.stompClient.activate();
  }

  private retryConnection(userId: string, onMessage: (message: string) => void): void {
    if (this.retryAttempts >= this.maxRetryAttempts) {
      console.error("Max retry attempts reached. Unable to reconnect to STOMP WebSocket.");
      return;
    }

    this.retryAttempts++;
    const delay = this.retryDelay * this.retryAttempts;

    console.log(`Retrying connection in ${delay / 1000} seconds (Attempt ${this.retryAttempts}/${this.maxRetryAttempts})...`);
    setTimeout(() => {
      this.connectStompWebSocket(userId, onMessage);
    }, delay);
  }

  // Connect to raw WebSocket
  connectRawWebSocket(userId: string, onMessage: (message: string) => void): void {
    if (this.rawSocket && this.rawSocket.readyState === WebSocket.OPEN) {
      console.warn("Raw WebSocket is already connected.");
      return;
    }

    const socketUrl = `${BASE_API_URL}/ws/notification-raw?userId=${userId}`;
    this.rawSocket = new WebSocket(socketUrl);

    this.rawSocket.onopen = () => console.log("Raw WebSocket connected.");

    this.rawSocket.onmessage = (event) => {
      onMessage(event.data);
      this.eventEmitter.emit("notification", event.data);
    };

    this.rawSocket.onerror = (error) => console.error("Raw WebSocket Error:", error);
    this.rawSocket.onclose = () => console.log("Raw WebSocket disconnected.");
  }

  // Disconnect all WebSockets
  disconnectWebSocket(): void {
    if (this.stompClient?.connected) {
      this.stompClient.deactivate();
    }
    if (this.rawSocket?.readyState === WebSocket.OPEN) {
      this.rawSocket.close();
    }
  }

  // Listen for notification events
  onNotification(callback: (message: string) => void): void {
    this.eventEmitter.on("notification", callback);
  }

  offNotification(callback: (message: string) => void): void {
    this.eventEmitter.off("notification", callback);
  }

  // Fetch notifications
  async getAllNotifications(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/restaurant-notifications`, { headers: authHeader() });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await axios.patch(`${API_URL}/mark-read/${notificationId}`, {}, { headers: authHeader() });
    } catch (error) {
      handleError(error);
    }
  }

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    try {
      await axios.post(`${API_URL}/mark-all-read`, {}, { headers: authHeader() });
    } catch (error) {
      handleError(error);
    }
  }

    // Clear all notifications
    async clearAllNotifications(): Promise<void> {
      try {
        await axios.delete(`${API_URL}/clear-all`, { headers: authHeader() });
        console.log("All notifications cleared.");
      } catch (error) {
        handleError(error);
      }
    }

  // Send notification
  async sendNotification(userId: string, message: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/send`, { userId, message }, { headers: authHeader() });
    } catch (error) {
      handleError(error);
    }
  }
}

export default new NotificationService();
