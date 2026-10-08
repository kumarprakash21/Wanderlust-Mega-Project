# ------------------- Stage 1: Build Stage ------------------------------
FROM node:22-bookworm-slim AS frontend-builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# ------------------- Stage 2: Final Stage ------------------------------
FROM node:22-bookworm-slim

# Set the working directory to /app
WORKDIR /app

# Copy built assets and dependencies from frontend-builder stage
COPY --from=frontend-builder /app .

# Expose port 5173 for the Node.js application
EXPOSE 5173

# Define the default command to run the application in development mode
USER node
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
