import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: true, // Use 'true' or specify '10.20.11.29' explicitly
  //   port: 5173,
  // },
  css: {
    postcss: "./postcss.config.js",
  },
});
