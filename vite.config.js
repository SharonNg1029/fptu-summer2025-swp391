import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss plugin if needed
// import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove tailwindcss() from here; Tailwind CSS is usually configured via postcss.config.js
  server: {
    allowedHosts: [
      "5a70-42-119-31-4.ngrok-free.app", // Add your ngrok domain here
    ],
  },
});
