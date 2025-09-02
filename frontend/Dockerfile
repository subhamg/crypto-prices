FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS build
ARG BACKEND_URL
ENV BACKEND_URL=${BACKEND_URL}
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY app ./app
COPY components ./components
COPY public ./public
COPY lib ./lib
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY package*.json ./
COPY next.config.mjs ./
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]


