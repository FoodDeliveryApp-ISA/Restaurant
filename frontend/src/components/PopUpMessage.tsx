import React, { useEffect, useState } from "react";

interface PopUpMessageProps {
    message: string;
    onClose: () => void;
    duration?: number; // Duration in milliseconds (default: 3000ms)
}

const PopUpMessage: React.FC<PopUpMessageProps> = ({ message, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        visible && (
            <div style={popupStyle}>
                <p>{message}</p>
            </div>
        )
    );
};

const popupStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
};
export default PopUpMessage;
