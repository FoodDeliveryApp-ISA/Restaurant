// restaurant.dto.ts

export interface RestaurantResponseDto {
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

export interface RequestUpdatedRestaurantDto {
  restaurantName: string;
  restaurantEmail: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  active: boolean;
  coverImageUrl: string;
}
