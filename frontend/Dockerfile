# Use Node.js LTS image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose port 3000 for the frontend
EXPOSE 3000

# Start the frontend dev server
CMD ["npm", "run", "dev"]