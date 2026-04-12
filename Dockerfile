# Build stage
FROM node:22-alpine AS builder

RUN npm install -g pnpm@8

WORKDIR /app

# Accept version as build argument
ARG APP_VERSION=development
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

COPY package.json pnpm-lock.yaml ./

# Install dependencies (ignore scripts to avoid premature prisma generate)
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY prisma ./prisma
RUN pnpm db:generate

COPY . .

RUN pnpm build

# Production stage
FROM node:22-alpine AS runner

RUN npm install -g pnpm@8

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy version from builder
ARG APP_VERSION=development
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy dependencies (including generated Prisma Client) from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application, config, and prisma schema from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Create entrypoint script that deploys migrations then starts the app
RUN printf '#!/bin/sh\nset -e\necho "Deploying database migrations..."\npnpm exec prisma migrate deploy\necho "Starting application..."\nexec pnpm start\n' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh \
    && chown nextjs:nodejs /app/entrypoint.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode < 400 ? 0 : 1)).on('error', _ => process.exit(1))"

ENTRYPOINT ["/app/entrypoint.sh"]
