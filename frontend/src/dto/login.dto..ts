import { z } from "zod";

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

// Infer TypeScript Type
export type LoginDTO = z.infer<typeof LoginSchema>;
