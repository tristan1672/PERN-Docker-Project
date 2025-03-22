import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Expose the server to the network
    port: 3000, // Ensure Vite uses port 3000 to match the Docker port mapping
  },
});