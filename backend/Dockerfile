# Backend Production Dockerfile
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy configuration files
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy source code
COPY src ./src

# Build application
RUN npm run build

# Remove dev dependencies and source files
RUN npm prune --production && \
    rm -rf src tsconfig.json nest-cli.json

# Expose port
EXPOSE 3001

# Start production server
CMD ["node", "dist/main"]

