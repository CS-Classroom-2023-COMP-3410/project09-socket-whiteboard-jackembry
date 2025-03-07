import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Allows access from outside the container
    port: 5173, // Ensures Vite runs on the correct port
    strictPort: true, // Prevents Vite from switching ports
  },
  optimizeDeps: {
    include: ["socket.io-client"],
  }
});