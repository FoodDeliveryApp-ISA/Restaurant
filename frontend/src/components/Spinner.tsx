import React from "react";
import { Spin } from "antd";
import { motion } from "framer-motion";

const Spinner: React.FC = () => {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Spin
        size="large"
        className="text-blue-500 dark:text-blue-300"
        tip={
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-gray-700 dark:text-gray-200"
          >
            Loading...
          </motion.span>
        }
      />
    </motion.div>
  );
};

export default Spinner;
