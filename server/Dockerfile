# Use official Node.js 20 slim image for smaller footprint
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the application port
EXPOSE 8080

# Set PORT for Cloud Run compatibility
ENV PORT=8080

# Run as non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Start the server
CMD ["node", "index.js"]
