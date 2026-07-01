import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the warning threshold slightly (JSON data chunks can be large)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor: React runtime
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // Vendor: Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Vendor: Zustand
          if (id.includes("node_modules/zustand")) {
            return "vendor-zustand";
          }
          // Vendor: Lucide icons (large icon set)
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-lucide";
          }
        },
      },
    },
  },
});
