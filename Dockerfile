# Multi-stage Dockerfile for unified Google Cloud Run deployment

# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# We set this at build time to use relative path if we serve from the same origin
ENV REACT_APP_API_URL=/api
# Prevent React build from failing on warnings in CI environments
ENV CI=false
RUN npm run build

# Stage 2: Setup the Express backend and serve the frontend
FROM node:18-alpine
WORKDIR /app/server

# Install backend dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy backend source
COPY server/ ./

# Copy built frontend from Stage 1 into the correct path relative to the server
# Since WORKDIR is /app/server and index.js looks for ../client/build
COPY --from=frontend-builder /app/client/build /app/client/build

# Set environment to production and port for Cloud Run
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
