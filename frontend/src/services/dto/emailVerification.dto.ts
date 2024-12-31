// DTOs
export interface RequestVerificationDto {
    email: string;
  }
  
  export interface VerifyEmailDto {
    email: string;
    verificationCode: string;
  }