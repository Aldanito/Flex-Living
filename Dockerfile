# Multi-stage build for Flex Living application
FROM node:18-alpine as backend-builder

# Build backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine

# Install nginx and wget for serving frontend and health checks
RUN apk add --no-cache nginx wget

# Set working directory
WORKDIR /app

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
# Install only production dependencies for runtime
WORKDIR /app/backend
RUN npm ci --only=production
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S appuser
RUN adduser -S appuser -u 1001

# Set permissions
RUN chown -R appuser:appuser /app
RUN chown -R appuser:appuser /usr/share/nginx/html
RUN chown -R appuser:appuser /var/lib/nginx
RUN chown -R appuser:appuser /var/log/nginx
RUN chown -R appuser:appuser /etc/nginx

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'set -e' >> /start.sh && \
    echo 'echo "Starting Nginx..."' >> /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'echo "Starting Backend API..."' >> /start.sh && \
    echo 'cd /app/backend' >> /start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /start.sh && \
    echo 'echo "Contents: $(ls -la)"' >> /start.sh && \
    echo 'echo "Package.json exists: $(test -f package.json && echo "yes" || echo "no")"' >> /start.sh && \
    echo 'node dist/index.js' >> /start.sh && \
    chmod +x /start.sh

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 80 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start both services
CMD ["/start.sh"]
