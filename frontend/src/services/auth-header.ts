import TokenUtil from "../utils/tokenUtil";

export default function authHeader(): Record<string, string> {
  const token = TokenUtil.getToken();

  if (token) {
    return { Authorization: `Bearer ${token}` }; // For Spring Boot back-end
    // return { 'x-access-token': token }; // For Node.js Express back-end
  } else {
    return {};
  }
}
