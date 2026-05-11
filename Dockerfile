# ---- Base ----
FROM node:22-alpine AS base

# Use corepack (built into Node) instead of global npm install
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

# Frozen lockfile ensures reproducible builds
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY prisma ./prisma
RUN pnpm db:generate

# ---- Builder ----
FROM base AS builder
WORKDIR /app

ARG APP_VERSION=development
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ARG APP_VERSION=development
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Public assets (cacheable, no sensitive data)
COPY --from=builder /app/public ./public

# Standalone server + static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + CLI for migrations
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=deps /app/node_modules/.bin ./node_modules/.bin
COPY --from=deps /app/node_modules/.modules.yaml ./node_modules/.modules.yaml
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Entrypoint: run migrations then start
RUN printf '#!/bin/sh\nset -e\necho "Deploying database migrations..."\n./node_modules/.bin/prisma migrate deploy\necho "Starting application..."\nexec node server.js\n' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Drop privileges
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
