# Build stage
FROM node:lts-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Accept version as build argument
ARG APP_VERSION=development
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

COPY package.json pnpm-lock.yaml ./

# Install dependencies (ignore scripts to avoid premature prisma generate)
RUN pnpm install --no-frozen-lockfile --ignore-scripts


COPY prisma ./prisma
RUN pnpm db:generate

COPY . .

RUN pnpm build

# Production stage
FROM node:lts-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy version from builder
ARG APP_VERSION=development
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

# Copy dependencies (including generated Prisma Client) from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built application, config, and prisma schema from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Create entrypoint script that deploys migrations then starts the app
RUN printf '#!/bin/sh\nset -e\necho "Deploying database migrations..."\npnpm exec prisma migrate deploy\necho "Starting application..."\nexec pnpm start\n' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
