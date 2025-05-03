import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // Use a different port for Vite
    proxy: {
      '/login': 'http://localhost:5000',
      '/signup': 'http://localhost:5000',
      '/movies': 'http://localhost:5000',
      '/movie': 'http://localhost:5000',
      '/showtime': 'http://localhost:5000',
      '/showtimes': 'http://localhost:5000',
      '/theaters': 'http://localhost:5000',
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
