FROM oven/bun as base

WORKDIR /app

# Copy package.json and lockfile first for better caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["bun", "run", "start"] 