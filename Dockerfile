# Build stage
FROM node:20.9.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install dependencies (ignore scripts to avoid premature prisma generate)
RUN pnpm install --no-frozen-lockfile --ignore-scripts


COPY prisma ./prisma
RUN pnpm db:generate

COPY . .

RUN pnpm build

# Production stage
FROM node:20.9.0-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy dependencies (including generated Prisma Client) from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built application and config from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./


EXPOSE 3000

CMD ["pnpm", "start"]
