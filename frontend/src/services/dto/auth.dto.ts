// auth.dto.ts

export interface RegisterRequest {
  restaurantEmail: string;
  restaurantPassword: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  active: boolean;
  coverImageUrl: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface Restaurant {
  restaurantId: number;
  restaurantEmail: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantCity: string;
  restaurantLocation: string;
  active: boolean;
  coverImageUrl: string;
}
