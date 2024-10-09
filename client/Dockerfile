# Stage 1: Build Stage
FROM node:20-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set the API URL (as it is injected at build time)
ARG API_URL=invalid
ENV VITE_API_URL=${API_URL}

# Build the project
RUN npm run build

# Stage 2: Production Stage
FROM nginx:stable-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
