// src/schemas/RestaurantLoginSchema.ts
import { z } from "zod";

// Schema for validation
export const RestaurantLoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

// DTO (Data Transfer Object) inferred from the schema
export type RestaurantLoginDTO = z.infer<typeof RestaurantLoginSchema>;
