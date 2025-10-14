# Use Node.js image
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build frontend
RUN npm run build

# Expose React port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
