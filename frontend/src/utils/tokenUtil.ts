import CryptoJS from "crypto-js";
import {jwtDecode} from "jwt-decode";

const SECRET_KEY = "your_secret_key"; // Use environment variables for this key

class TokenUtil {
  private static STORAGE_KEY = "authToken";

  // Encrypt and store the token
  static storeToken(token: string): void {
    const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
    localStorage.setItem(this.STORAGE_KEY, encryptedToken);
  }

  // Retrieve and decrypt the token
  static getToken(): string | null {
    const encryptedToken = localStorage.getItem(this.STORAGE_KEY);
    if (!encryptedToken) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Failed to decrypt token:", error);
      return null;
    }
  }

  // Decode the JWT and extract claims
  static decodeToken(token: string): { [key: string]: any } | null {
    try {
      return jwtDecode<{ [key: string]: any }>(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  // Get the restaurantId from the token
  static getRestaurantId(): string | number | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    return decodedToken?.restaurantId ?? null;
  }
  // Get the email (sub) from the token
  static getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    return decodedToken?.sub ?? null;
  }

  // Remove the token
  static removeToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check if a token exists
  static isTokenAvailable(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}

export default TokenUtil;
