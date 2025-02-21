# Use an Alpine-based Bun image
FROM imbios/bun-node:1.1.18-18.20.2-alpine

# Install PM2 globally
RUN bun add -g pm2

# Set working directory
WORKDIR /app

# Default command: Start PM2 with the ecosystem file
CMD ["pm2-runtime", "start", "src/workers/ecosystem.config.cjs"]
