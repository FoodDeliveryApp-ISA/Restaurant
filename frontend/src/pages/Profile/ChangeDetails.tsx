import React from "react";
import { Card } from "antd";
import { motion } from "framer-motion";
import ChangeEmail from "./components/ChangeEmail";
import ChangeLocation from "./components/ChangeLocation";
import ChangePassword from "./components/ChangePassword";
import "tailwindcss/tailwind.css";

interface RestaurantResponseDto {
  restaurantId: number;
  restaurantName: string;
  restaurantEmail: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  active: boolean;
  coverImageUrl: string;
}

interface RestaurantProps {
  restaurant: RestaurantResponseDto | null;
}

const ChangeDetails: React.FC<RestaurantProps> = ({ restaurant }) => {
  return (
    <div
    >
      <motion.div
        className="flex flex-wrap justify-evenly items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="transition-transform duration-300"
        >
          <ChangeLocation restaurant={restaurant} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="transition-transform duration-300"
        >
          <ChangeEmail restaurant={restaurant} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="transition-transform duration-300"
        >
          <ChangePassword />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChangeDetails;
