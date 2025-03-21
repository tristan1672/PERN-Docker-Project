# Use Node.js LTS image
FROM node:18

# Set the working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose port 5000 for the API
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "dev"]