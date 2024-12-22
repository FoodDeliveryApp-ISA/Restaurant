# Use Node.js official image for the build stage
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the React app source code
COPY . .

# Build the React app for production
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:alpine

# Copy the build files from the build stage to the Nginx server
COPY --from=build /app/build /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
