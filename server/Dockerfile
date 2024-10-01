FROM node:20-alpine AS base

# Dependencies stage.
FROM base AS dependencies

# Install the glibc compatibility layer, for potential binary dependencies.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

# Install dependencies preserving the lock file. (ci = clean install).
RUN npm ci

# Build stage.
FROM base AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Production stage.
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/package.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist/ .

ENV HOST="0.0.0.0"

EXPOSE 5000

ENV PORT=5000

CMD ["npm", "run", "start"]
