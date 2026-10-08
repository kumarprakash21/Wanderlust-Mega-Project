# Stage 1
FROM node:22-bookworm-slim AS backend-builder

# setup the working dir
WORKDIR /app

# code
COPY package*.json ./
RUN npm ci
COPY . .

# packages install
# tests
RUN npm run test

# Stage 2
FROM node:22-bookworm-slim

# setup the working dir
WORKDIR /app

# copy the above stage as compressed
COPY --from=backend-builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=backend-builder /app .

USER node

# Port
EXPOSE 8080

# App
CMD ["npm", "start"]
