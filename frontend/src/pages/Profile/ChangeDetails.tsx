import React from "react";
// import { Button } from "antd";
import ChangeEmail from "./components/ChangeEmail:";
import ChangeLocation from "./components/ChangeLocation";
// import ChangePassword from "./components/ChangePassword";

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
    <div>
      <h2>Manage Details for {restaurant?.restaurantName}</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <ChangeLocation restaurant={restaurant} />
        <ChangeEmail restaurant={restaurant} />
        {/* <ChangePassword restaurant={restaurant} /> */}
      </div>
    </div>
  );
};

export default ChangeDetails;