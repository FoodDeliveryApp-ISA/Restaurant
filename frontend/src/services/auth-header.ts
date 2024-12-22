export default function authHeader(): Record<string, string> {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  if (parsedUser && parsedUser.accessToken) {
    return { Authorization: `Bearer ${parsedUser.accessToken}` }; // for Spring Boot back-end
    // return { 'x-access-token': parsedUser.accessToken }; // for Node.js Express back-end
  } else {
    return {};
  }
}
