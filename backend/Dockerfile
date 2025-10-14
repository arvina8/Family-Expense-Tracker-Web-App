# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of backend files
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "run", "dev"]
