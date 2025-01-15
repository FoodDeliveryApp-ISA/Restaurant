import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";



export default defineConfig({
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
  plugins: [
    react(),
    nodePolyfills(), // Ensures Node.js polyfills are included
  ],
  resolve: {
    alias: {
      util: "util", // Ensures compatibility for "util" imports
    },
  },
  // build: {
  //   outDir: "dist", // Explicitly set the output directory for production builds
  //   sourcemap: true, // Enable source maps for debugging production issues
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // Split vendor code into separate chunks for better caching
  //         vendor: ["react", "react-dom"],
  //       },
  //     },
  //   },
  // },
  // server: {
  //   port: 3000, // Set the dev server port
  //   open: true, // Automatically open the browser on server start
  // },
  // define: {
  //   // Define global constants for use in your app
  //   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
  // },
});
