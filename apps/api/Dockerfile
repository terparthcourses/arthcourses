# apps/api/Dockerfile

# Set base image
FROM node:20-alpine AS base

# Set up environment variables
ENV PNPM_HOME="/root/.pnpm-global"
ENV PATH="$PNPM_HOME:$PATH"

# Install system dependencies
RUN apk update
RUN apk add --no-cache libc6-compat

# Enable PNPM
RUN corepack enable
RUN corepack prepare pnpm@9.0.0 --activate

FROM base AS builder

# Set working directory
WORKDIR /repo

# Install Turbo
RUN pnpm config set global-bin-dir $PNPM_HOME && pnpm install turbo --global

COPY . .

# Prune files
RUN turbo prune api --docker

FROM base AS installer

# Set working directory
WORKDIR /app

# Copy pruned package manifests
COPY --from=builder /repo/out/json/ .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy full source code
COPY --from=builder /repo/out/full/ .

# Build the application
RUN pnpm turbo run build --filter=api

FROM base AS runner

# Set working directory
WORKDIR /app

# Create group and user
RUN addgroup -g 1001 applications 
RUN adduser -u 1001 -G applications -s /bin/sh -D api

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Copy files
COPY --from=installer /app .

# Change ownership
RUN chown -R api:applications /app

# Run as non-root user
USER api

# Start application
CMD ["node", "./apps/api/dist/index.js"]
