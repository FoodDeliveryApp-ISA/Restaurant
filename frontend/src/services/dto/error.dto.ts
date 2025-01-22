export interface ErrorResponse {
  timestamp: string; // ISO date string
  status: number;
  error: string;
  message: string;
  path: string;
}
