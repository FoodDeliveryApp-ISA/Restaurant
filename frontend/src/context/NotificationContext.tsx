import React, { createContext, useContext, useEffect, useState } from "react";
import NotificationService from "../services/notification.service";

interface Notification {
    id: number;
    type: string;
    description: string;
    datetime: string;
}

interface NotificationContextValue {
    notifications: Notification[];
    addNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string) => {
        const newNotification: Notification = {
            id: Date.now(),
            type: "notification",
            description: message,
            datetime: new Date().toLocaleString(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    useEffect(() => {
        console.log("Connecting to WebSocket...");
        NotificationService.connectStompWebSocket("353", addNotification);

        return () => {
            console.log("Disconnecting from WebSocket...");
            NotificationService.disconnectWebSocket();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
