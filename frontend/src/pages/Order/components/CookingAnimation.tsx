import React from "react";
import { motion } from "framer-motion";

const CookingAnimation: React.FC = () => {
  return (
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: 200,
      }}
    >
      {/* Animated Pan */}
      <motion.div
        style={{
          fontSize: 50,
          marginBottom: 10,
          color: "#FF6347", // Tomato color for the pan
        }}
        animate={{
          y: [0, -20, 0], // Bouncing effect
          rotate: [0, 15, -15, 0], // Slight rotation
          scale: [1, 1.1, 1], // Pulsing effect
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🍳
      </motion.div>

      {/* Animated Steam */}
      <motion.div
        style={{
          fontSize: 30,
          opacity: 0.6,
          color: "#D3D3D3", // Light gray steam
        }}
        animate={{
          y: [0, -30], // Rising steam effect
          opacity: [0.6, 0.1], // Fading effect
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeOut",
        }}
      >
        💨
      </motion.div>
    </motion.div>
  );
};

export default CookingAnimation;
