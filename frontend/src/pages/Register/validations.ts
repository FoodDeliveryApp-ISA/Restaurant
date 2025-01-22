import ValidationService from "../../services/validation.service"; // Adjust the path

/**
 * Validates restaurant name for uniqueness.
 */
export const validateRestaurantName = async (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Please enter the restaurant name."));
  }
  try {
    const isUniqueMessage = await ValidationService.validateRestaurant(value.trim());
    if (isUniqueMessage !== "Restaurant name is unique.") {
      return Promise.reject(new Error(isUniqueMessage || "Restaurant name is already taken."));
    }
  } catch (error) {
    return Promise.reject(new Error("Restaurant name is already taken"));
  }
};

/**
 * Validates email format and uniqueness.
 */
export const validateEmail = async (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Please enter your email."));
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return Promise.reject(new Error("Please enter a valid email address."));
  }
  try {
    const isUniqueMessage = await ValidationService.validateEmail(value.trim());
    if (isUniqueMessage !== "Email is unique.") {
      return Promise.reject(new Error(isUniqueMessage || "Email is already taken."));
    }
  } catch (error) {
    return Promise.reject(new Error("Email is already taken"));
  }
};

/**
 * Validation rules for password strength.
 */
export const passwordRules = [
  { required: true, message: "Please enter your password." },
  { min: 6, message: "Password must be at least 6 characters long." },
//   {
//     pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
//     message:
//       "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
//   },
];

/**
 * Validation rules for address.
 */
export const addressRule = [
  { required: true, message: "Address is required." },
  { max: 255, message: "Address cannot exceed 255 characters." },
];

/**
 * Validation rules for phone number.
 */
export const phoneNumberRule = [
  { required: true, message: "Phone number is required." },
  {
    pattern: /^\+?[0-9]{10,15}$/,
    message: "Phone number must be between 10 and 15 digits and can include an optional '+' sign.",
  },
];

/**
 * Validation rules for city.
 */
export const cityRule = [
  { required: true, message: "City is required." },
  { max: 100, message: "City name cannot exceed 100 characters." },
];

/**
 * Validation rules for location.
 */
export const locationRule = [
  { required: true, message: "Location is required." },
];
