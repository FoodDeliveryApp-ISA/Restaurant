const API_URLS = {
  development: "http://localhost:8081",
  production: "https://10.20.11.29:8081",
};

const environment = process.env.NODE_ENV || "development";
export const API_URL = API_URLS[environment];
