const API_URLS = {
  development: "http://localhost:8081/api",
  production: "https://your-production-url/api",
};

const environment = process.env.NODE_ENV || "development";
export const API_URL = API_URLS[environment];
