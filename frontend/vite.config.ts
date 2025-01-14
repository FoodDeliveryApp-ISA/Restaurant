import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(), // Use the named import for the plugin
  ],
  resolve: {
    alias: {
      util: "util",
    },
  },
});

