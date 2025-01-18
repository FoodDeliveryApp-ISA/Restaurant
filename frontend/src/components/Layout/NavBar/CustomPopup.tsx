import { FC, useEffect } from "react";
import { motion } from "framer-motion";
import { CloseOutlined } from "@ant-design/icons";

interface CustomPopupProps {
  message: string;
  onClose: () => void;
  customClassName?: string;
  index: number; // To determine stack position
}

const CustomPopup: FC<CustomPopupProps> = ({ message, onClose, customClassName, index }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const stackOffset = index * 10; // Offset for stacking

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl border border-gray-300 p-4 w-11/12 sm:w-96 max-w-full flex items-start space-x-3 z-50 transition-transform duration-500 ease-in-out ${customClassName}`}
      style={{ marginTop: stackOffset }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-1">
        <p className="text-gray-900 text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 rounded-full"
        aria-label="Close popup"
      >
        <CloseOutlined className="text-lg" />
      </button>
    </motion.div>
  );
};

export default CustomPopup;
