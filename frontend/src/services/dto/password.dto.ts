/**
 * Data Transfer Object for requesting a password reset.
 */
export interface ForgetPasswordDto {
  email: string; // The email address of the user requesting a password reset
}

/**
 * Data Transfer Object for resetting a password.
 */
export interface ResetPasswordDto {
  token: string; // The reset token for validating the password reset request
  newPassword: string; // The new password to be set
}

/**
 * Data Transfer Object for changing a password.
 */
export interface ChangePasswordDto {
  email: string; // The email address of the authenticated user
  oldPassword: string; // The user's current password
  newPassword: string; // The new password to be set
}
