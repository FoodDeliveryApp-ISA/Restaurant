import { Client, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import authHeader from "./auth-header";
import { BASE_API_URL } from "../config/apiConfig";
import { BASE_WS_URL, STOMP_CONFIG, getWebSocketUrl } from "../config/websocket.config";
import { handleError } from "../utils/errorHandler";

const API_URL = `${BASE_API_URL}/api/notifications`;

class NotificationService {
  private stompClient: Client | null = null;
  private websocket: WebSocket | null = null;
  private handleError: (error: unknown) => Promise<void>;

  constructor() {
    this.handleError = handleError;
  }

  connectWebSocket(userId: string, onMessage: (message: string) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      console.warn("STOMP WebSocket is already connected.");
      return;
    }

    const socketUrl = getWebSocketUrl("notification");
    const socket = new SockJS(socketUrl);

    this.stompClient = new Client({
      ...STOMP_CONFIG,
      webSocketFactory: () => socket,
    });

    this.stompClient.onConnect = () => {
      console.log("STOMP WebSocket connected.");
      this.stompClient?.subscribe(`/topic/notifications/${userId}`, (msg: Message) => {
        console.log(`Message received on topic /topic/notifications/${userId}:`, msg.body);
        onMessage(msg.body);
      });
    };

    this.stompClient.onStompError = (error) => {
      console.error("STOMP WebSocket error:", error);
    };

    this.stompClient.activate();
  }

  connectNativeWebSocket(userId: string, onMessage: (message: string) => void): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      console.warn("Native WebSocket is already connected.");
      return;
    }

    const url = getWebSocketUrl("notification", { userId });
    console.log(`Connecting to WebSocket at: ${url}`);
    this.websocket = new WebSocket(url);

    this.websocket.onopen = () => {
      console.log("Native WebSocket connected.");
    };

    this.websocket.onmessage = (event) => {
      console.log("Message received via native WebSocket:", event.data);
      onMessage(event.data);
    };

    this.websocket.onclose = () => {
      console.warn("Native WebSocket disconnected.");
    };

    this.websocket.onerror = (error) => {
      console.error("Native WebSocket error:", error);
    };
  }

  disconnectStompWebSocket(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
      console.log("STOMP WebSocket disconnected.");
    } else {
      console.warn("STOMP WebSocket is not connected.");
    }
  }

  disconnectNativeWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      console.log("Native WebSocket disconnected.");
    } else {
      console.warn("Native WebSocket is not connected.");
    }
  }

  sendStompMessage(destination: string, message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({ destination, body: message });
      console.log("Message sent via STOMP:", message);
    } else {
      console.warn("STOMP WebSocket is not connected.");
    }
  }

  sendNativeMessage(message: string): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
      console.log("Message sent via native WebSocket:", message);
    } else {
      console.warn("Native WebSocket is not connected.");
    }
  }

  async getAllNotifications(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${API_URL}/restaurant-notifications`, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await axios.patch(`${API_URL}/mark-read/${notificationId}`, {}, { headers: authHeader() });
      console.log(`Notification ${notificationId} marked as read.`);
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axios.post(`${API_URL}/mark-all-read`, {}, { headers: authHeader() });
      console.log("All notifications marked as read.");
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async sendNotificationToUser(userId: string, message: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/send`, { userId, message }, { headers: authHeader() });
      console.log(`Notification sent to user ${userId}: ${message}`);
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }
}

export default new NotificationService();
