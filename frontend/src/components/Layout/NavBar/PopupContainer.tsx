import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CustomPopup from "./CustomPopup";

const PopupContainer = () => {
  const [popups, setPopups] = useState<string[]>([]);

  const addPopup = (message: string) => {
    setPopups((prev) => [...prev, message]);
  };

  const removePopup = (index: number) => {
    setPopups((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => addPopup(`Message ${popups.length + 1}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Show Popup
      </button>

      {/* Popup Container */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
        <AnimatePresence>
          {popups.map((message, index) => (
            <CustomPopup
              key={index}
              message={message}
              onClose={() => removePopup(index)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PopupContainer;
