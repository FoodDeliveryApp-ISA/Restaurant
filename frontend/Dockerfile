# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy only the package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire source code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the build files from the build stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the Nginx port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
