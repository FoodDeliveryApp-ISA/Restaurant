import { z } from "zod";

// Define the validation schema for restaurant registration
export const RestaurantRegistrationSchema = z.object({
  restaurantName: z
    .string()
    .min(3, "Restaurant name must be at least 3 characters long")
    .max(100, "Restaurant name must not exceed 100 characters")
    .nonempty("Restaurant name is required"),

  restaurantEmail: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),

  restaurantPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),

  restaurantAddress: z
    .string()
    .min(10, "Address must be at least 10 characters long")
    .max(200, "Address must not exceed 200 characters")
    .nonempty("Restaurant address is required"),

  restaurantPhone: z
    .string()
    .regex(
      /^\+?\d{10,15}$/,
      "Phone number must be between 10 and 15 digits long"
    )
    .nonempty("Phone number is required"),

  restaurantCity: z
    .string()
    .min(2, "City name must be at least 2 characters long")
    .nonempty("City is required"),

  restaurantLocation: z
    .string()
    .regex(
      /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/,
      "Please enter a valid latitude and longitude (e.g., 37.7749, -122.4194)"
    )
    .nonempty("Location is required"),
});

// Define the TypeScript DTO (Data Transfer Object) that matches the schema
export type RestaurantRegistrationDTO = z.infer<
  typeof RestaurantRegistrationSchema
>;
