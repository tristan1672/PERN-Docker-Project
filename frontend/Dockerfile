# Use Node.js LTS image
FROM node:18-alpine

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with a custom approach to handle the Rollup issue
RUN npm install --no-package-lock && \
    # Create a fake module to satisfy the missing dependency
    mkdir -p node_modules/@rollup && \
    echo 'module.exports = { loadNative: () => null };' > node_modules/@rollup/rollup-linux-x64-gnu.js

# Copy the rest of the frontend code
COPY . .

# Update vite.config.ts to ensure it listens on all interfaces
RUN sed -i 's/export default defineConfig({/export default defineConfig({\n  server: {\n    host: "0.0.0.0",\n  },/' vite.config.ts || \
    echo 'import { defineConfig } from "vite";\nexport default defineConfig({\n  server: {\n    host: "0.0.0.0"\n  }\n});' > vite.config.ts

# Expose port for the frontend
EXPOSE 3000

# Start the frontend dev server with a workaround
CMD ["sh", "-c", "ROLLUP_SKIP_NODEJS_NATIVE=1 npm run dev"]