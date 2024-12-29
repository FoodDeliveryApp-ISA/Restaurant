import CryptoJS from "crypto-js";

const SECRET_KEY = "your_secret_key"; // Use environment variables for this key

class TokenUtil {
  // Encrypt and store the token
  static storeToken(token: string): void {
    const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
    localStorage.setItem("authToken", encryptedToken);
  }

  // Retrieve and decrypt the token
  static getToken(): string | null {
    const encryptedToken = localStorage.getItem("authToken");
    if (!encryptedToken) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Failed to decrypt token:", error);
      return null;
    }
  }

  // Remove the token
  static removeToken(): void {
    localStorage.removeItem("authToken");
  }

  // Check if a token exists
  static isTokenAvailable(): boolean {
    return !!localStorage.getItem("authToken");
  }
}

export default TokenUtil;
