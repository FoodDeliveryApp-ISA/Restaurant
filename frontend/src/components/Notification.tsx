import React, { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import PopUpMessage from "./PopUpMessage"; // Import your PopUpMessage component

const OrdersNotification: React.FC = () => {
    const { notifications } = useNotifications();
    const [activeNotification, setActiveNotification] = useState<string | null>(null);

    useEffect(() => {
        if (notifications.length > 0 && !activeNotification) {
            setActiveNotification(notifications[0].description);
        }
    }, [notifications, activeNotification]);

    const handleClose = () => {
        setActiveNotification(null);
    };

    return (
        <>
            {activeNotification && (
                <PopUpMessage message={activeNotification} onClose={handleClose} />
            )}
        </>
    );
};

export default OrdersNotification;
