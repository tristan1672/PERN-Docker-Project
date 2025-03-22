# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on

EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]