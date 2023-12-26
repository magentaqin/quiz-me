# STAGE 1: install
FROM node:16.7-alpine AS base
WORKDIR /base
# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci -only=prod 
# Copy project 
COPY . .

# STAGE 2: build
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

# STAGE 3: app
FROM base AS app
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next/
COPY --from=build /build/public ./public/
COPY --from=build /build/node_modules ./node_modules/
COPY --from=build /build/next.config.js ./

EXPOSE 1306
CMD ["npm", "start"]
