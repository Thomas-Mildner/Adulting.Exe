# Build stage
FROM node:20.9.0-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN pnpm db:generate

# Copy application source
COPY . .

# Build the Next.js application
RUN pnpm build

# Production stage
FROM node:20.9.0-alpine AS runner

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install production dependencies only
RUN pnpm install --no-frozen-lockfile --production

# Generate Prisma Client
RUN pnpm db:generate

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
